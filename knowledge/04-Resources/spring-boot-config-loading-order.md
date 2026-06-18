---
title: Spring Boot 配置文件加载顺序踩坑记
description: 生产环境配置被覆盖导致服务异常，深入排查后发现是 Spring Boot 配置文件加载顺序理解不透彻，记录完整排查过程和正确用法
date: 2026-06-17 14:00:00
updated: 2026-06-17 14:00:00
tags:
  - Spring Boot
  - Java
  - 配置
categories:
  - Java学习
abbrlink: spring-boot-config-order
mathjax: false
---

## 前言

上个月上线了一个新功能，本地测试一切正常，发到生产环境后，数据库连接突然报错。排查了整整一下午，最后发现是 **配置文件加载顺序** 导致的坑。

Spring Boot 的配置文件加载顺序看似简单，实际上有很多细节容易忽略。

## 问题现象

项目结构：

```
src/main/resources/
├── application.yml          # 通用配置
├── application-dev.yml      # 开发环境
├── application-test.yml     # 测试环境
├── application-prod.yml     # 生产环境
└── bootstrap.yml            # 启动配置
```

`application-prod.yml` 中配置了生产环境数据库：

```yaml
spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/mydb
    username: prod_user
    password: ${DB_PASSWORD}
```

打包时指定了 `prod` 环境：

```bash
mvn clean package -Dspring.profiles.active=prod
```

但启动后日志显示连接的是 **开发环境数据库**！

## 排查过程

### 第一步：确认激活的 Profile

```bash
java -jar app.jar --debug
```

查看启动日志：

```
Active profiles: prod
```

Profile 确实激活了，但配置没生效？

### 第二步：查看配置加载顺序

加上 `--debug` 参数，Spring Boot 会输出详细的配置加载日志：

```bash
java -jar app.jar --debug 2>&1 | grep "Loaded config file"
```

输出：

```
Loaded config file 'file:./application.yml'
Loaded config file 'classpath:/application.yml'
Loaded config file 'classpath:/application-prod.yml'
Loaded config file 'file:./config/application.yml'
```

等等，`file:./application.yml` 是什么？

### 第三步：发现罪魁祸首

原来运维同事在启动脚本所在的目录放了一个 `application.yml`：

```bash
ls -la /opt/myapp/

# 输出
-rw-r--r-- 1 root root  2.1K Jun 10 09:30 application.yml    # 开发环境配置！
-rw-r--r-- 1 root root 45M Jun 10 09:30 app.jar
```

这个外部配置文件 **覆盖了** jar 包内的 `application-prod.yml` 配置！

## Spring Boot 配置文件加载顺序

Spring Boot 的配置文件按以下优先级加载（**后加载的覆盖先加载的**）：

### 1. 默认位置（优先级从低到高）

| 优先级 | 位置 | 说明 |
|--------|------|------|
| 1 | `classpath:/` | jar 包内的根目录 |
| 2 | `classpath:/config/` | jar 包内的 config 目录 |
| 3 | `file:./` | 当前运行目录 |
| 4 | `file:./config/` | 当前运行目录的 config 子目录 |
| 5 | `file:./config/*/` | 当前运行目录 config 的任意子目录 |

### 2. 配置文件类型优先级

同一位置下：

```
application.properties  <  application.yml  <  application.yaml
```

### 3. Profile 文件加载顺序

以 `application-prod.yml` 为例：

```
application.yml  ->  application-prod.yml
```

Profile 配置文件会 **覆盖** 主配置文件中相同的属性。

### 4. 完整的优先级（从高到低）

1. 命令行参数：`--server.port=8081`
2. `SPRING_APPLICATION_JSON` 环境变量
3. `ServletConfig` 初始化参数
4. `ServletContext` 初始化参数
5. JNDI 属性
6. Java 系统属性：`System.getProperties()`
7. 操作系统环境变量
8. `RandomValuePropertySource`：`random.*`
9. jar 包外部的 Profile 配置文件：`file:./application-prod.yml`
10. jar 包内部的 Profile 配置文件：`classpath:/application-prod.yml`
11. jar 包外部的配置文件：`file:./application.yml`
12. jar 包内部的配置文件：`classpath:/application.yml`
13. `@PropertySource` 注解加载的配置
14. 默认属性：`SpringApplication.setDefaultProperties()`

> **关键结论**：jar 包外部的 `application.yml` 优先级高于 jar 包内部的 `application-prod.yml`！

## 坑一：外部配置覆盖 Profile 配置

这是我最开始遇到的问题。运维在启动目录放了开发环境的 `application.yml`，导致生产环境配置被覆盖。

### 解决方案

**方案 1：使用 `spring.config.location` 限制配置位置**

```bash
java -jar app.jar --spring.config.location=classpath:/
```

只从 classpath 加载配置，忽略外部文件。

**方案 2：使用 `spring.config.name` 区分配置名**

```bash
java -jar app.jar --spring.config.name=application-prod
```

直接指定加载 `application-prod.yml`，不加载默认的 `application.yml`。

**方案 3：运维规范 - 统一使用外部 config 目录**

```bash
# 启动时指定配置文件位置
java -jar app.jar --spring.config.location=file:/opt/myapp/config/
```

将配置文件统一放在 `config` 目录，避免和 jar 包混在一起。

## 坑二：bootstrap.yml 加载时机

使用 Spring Cloud Config 时，`bootstrap.yml` 在 `application.yml` 之前加载，用于配置中心连接信息。

但如果不小心在 `bootstrap.yml` 中放了业务配置：

```yaml
# bootstrap.yml
spring:
  datasource:
    url: jdbc:mysql://old-db:3306/mydb
```

这个配置会被 `application.yml` 覆盖吗？

**答案：不会！** `bootstrap.yml` 和 `application.yml` 是不同的上下文，`bootstrap.yml` 中的配置不会被 `application.yml` 覆盖。

### 正确用法

`bootstrap.yml` 只放配置中心相关配置：

```yaml
spring:
  application:
    name: my-service
  cloud:
    config:
      uri: http://config-server:8888
      profile: prod
```

业务配置全部放在 `application.yml` 或 Profile 配置文件中。

## 坑三：@Value 注入时机

```java
@Component
public class MyConfig {
    
    @Value("${my.prop}")
    private String myProp;
    
    @PostConstruct
    public void init() {
        // 这里 myProp 可能还没被正确注入！
        System.out.println(myProp);
    }
}
```

如果在 `@PostConstruct` 中使用 `@Value` 注入的值，可能会拿到旧值或 null。

### 解决方案

使用 `@EventListener(ApplicationReadyEvent.class)`：

```java
@Component
public class MyConfig {
    
    @Value("${my.prop}")
    private String myProp;
    
    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        // 确保所有配置加载完成后再执行
        System.out.println(myProp);
    }
}
```

或者实现 `EnvironmentAware`：

```java
@Component
public class MyConfig implements EnvironmentAware {
    
    private Environment env;
    
    @Override
    public void setEnvironment(Environment env) {
        this.env = env;
    }
    
    public void doSomething() {
        String myProp = env.getProperty("my.prop");
        // 使用 env 获取配置更可靠
    }
}
```

## 坑四：配置加密与解密顺序

使用 Jasypt 加密配置时：

```yaml
spring:
  datasource:
    password: ENC(encrypted_password_here)
```

如果加密器初始化晚于配置加载，会导致解密失败。

### 解决方案

确保 Jasypt 配置在 `bootstrap.yml` 中：

```yaml
jasypt:
  encryptor:
    password: ${JASYPT_PASSWORD}
```

或者使用 Spring Boot 的 `EnvironmentPostProcessor`：

```java
public class DecryptEnvironmentPostProcessor implements EnvironmentPostProcessor {
    
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment env, 
                                       SpringApplication application) {
        // 在配置加载完成后解密
        // ...
    }
}
```

在 `META-INF/spring.factories` 中注册：

```properties
org.springframework.boot.env.EnvironmentPostProcessor=\
  com.example.DecryptEnvironmentPostProcessor
```

## 最佳实践

### 1. 项目配置规范

```
src/main/resources/
├── application.yml              # 通用配置（只放默认配置）
├── application-dev.yml          # 开发环境
├── application-test.yml         # 测试环境
├── application-prod.yml         # 生产环境
└── bootstrap.yml                # 配置中心连接（如有）
```

`application.yml` 中只放不随环境变化的配置：

```yaml
spring:
  application:
    name: my-service
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
```

### 2. 启动脚本规范

```bash
#!/bin/bash
# startup.sh

# 设置 JVM 参数
JAVA_OPTS="-Xms512m -Xmx1024m"

# 设置配置文件位置（统一放在 config 目录）
CONFIG_LOCATION="file:/opt/myapp/config/"

# 启动应用
java $JAVA_OPTS \
  -jar /opt/myapp/app.jar \
  --spring.config.location=$CONFIG_LOCATION \
  --spring.profiles.active=prod
```

### 3. 配置验证

启动时打印实际生效的配置：

```java
@Component
public class ConfigValidator implements CommandLineRunner {
    
    @Autowired
    private Environment env;
    
    @Override
    public void run(String... args) {
        System.out.println("===== 当前生效的配置 =====");
        System.out.println("数据源 URL: " + env.getProperty("spring.datasource.url"));
        System.out.println("激活的 Profile: " + String.join(",", env.getActiveProfiles()));
        System.out.println("配置位置: " + env.getProperty("spring.config.location"));
        System.out.println("=========================");
    }
}
```

### 4. 使用 Actuator 查看配置

添加依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

配置端点：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: env,configprops
```

访问 `http://localhost:8080/actuator/env` 查看所有配置来源和值。

## 总结

| 坑 | 原因 | 解决方案 |
|----|------|---------|
| 外部配置覆盖 Profile | `file:./application.yml` 优先级高于 `classpath:/application-prod.yml` | 使用 `spring.config.location` 限制加载位置 |
| bootstrap.yml 配置不生效 | 加载时机不同，属于不同上下文 | 只在 bootstrap 中放配置中心相关配置 |
| @Value 注入时机不对 | `@PostConstruct` 执行时配置可能未完全加载 | 使用 `ApplicationReadyEvent` 或 `EnvironmentAware` |
| 加密配置解密失败 | 加密器初始化晚于配置加载 | 使用 `EnvironmentPostProcessor` |

Spring Boot 的配置加载机制很灵活，但也因此容易踩坑。理解加载顺序，规范配置管理，能避免很多线上问题。

## 参考

- [Spring Boot 官方文档 - 外部化配置](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Spring Boot 配置加载顺序详解](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
