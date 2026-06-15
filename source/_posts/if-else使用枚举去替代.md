---
title: if else  使用枚举去替代
description: 🥧本文旨在解决多个if else 的问题
mathjax: true
tags:
  - "#枚举"
categories:
  - Java学习
abbrlink: 325324r
sticky: 2
swiper_index: 2
date: 2025-10-17T16:36:00
updated: 2025-10-17T16:36:00
---

# 一、痛点剖析：if-else 嵌套到底"病"在哪？

我们先冷静下来，分析一下 `if-else` 链的"症状"：

- **可读性差：** 逻辑分散，一眼看不出支持哪些分支。
- **扩展性差：** 新增类型需要修改原有代码，容易引入 Bug。
- **违反开闭原则：** 对扩展开放，对修改关闭？不存在的。
- **难以测试：** 所有逻辑挤在一个方法里，单元测试写起来像在拆炸弹。

而这些问题，恰恰是 `枚举 + 策略模式 + 函数式编程思想` 的绝佳用武之地。

# 二、破局之道：让枚举不再只是"常量集合"

很多人以为枚举只能干这事：

```java
public enum PayChannel {
    WECHAT, ALIPAY, BANKCARD, PAYPAL, APPLEPAY
}
```

错！Java 的枚举是功能完整的类，它可以：

- 拥有字段
- 定义构造函数
- 实现方法
- 持有行为（函数式接口）

这才是我们真正要的武器。

# 三、实战案例：用枚举重构支付渠道选择逻辑

### 方案一：枚举持有行为（函数式接口）

我们定义一个函数式接口来表示"支付行为"：

```java
@FunctionalInterface
public interface PayHandler {
    void pay(BigDecimal amount);
}
```

然后在枚举中为每种渠道绑定具体实现：

```java
public enum PayChannel {
    WECHAT("wechat", amount -> System.out.println("使用微信支付 " + amount)),
    ALIPAY("alipay", amount -> System.out.println("使用支付宝支付 " + amount)),
    BANKCARD("bankcard", amount -> System.out.println("使用银行卡支付 " + amount)),
    PAYPAL("paypal", amount -> System.out.println("使用PayPal支付 " + amount)),
    APPLEPAY("applepay", amount -> System.out.println("使用Apple Pay支付 " + amount));

    private final String code;
    private final PayHandler handler;

    PayChannel(String code, PayHandler handler) {
        this.code = code;
        this.handler = handler;
    }

    public void pay(BigDecimal amount) {
        handler.pay(amount);
    }

    // 根据 code 查找枚举实例
    public static PayChannel fromCode(String code) {
        return Arrays.stream(values())
                .filter(channel -> channel.code.equals(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("不支持的支付渠道: " + code));
    }

    public String getCode() {
        return code;
    }
}
```

使用方式：一行调用，干净利落

```java
// 模拟请求参数
String channelCode = "alipay";
BigDecimal amount = new BigDecimal("99.99");

// 查找并执行
PayChannel channel = PayChannel.fromCode(channelCode);
channel.pay(amount);
```

输出：

```text
使用支付宝支付 99.99
```

优点：逻辑集中，扩展只需新增枚举项，无需改动其他代码。

# 四、进阶玩法：结合 Spring 管理 Bean，实现"枚举调用服务"

上面的例子适合轻量逻辑。但如果每个支付方式都需要调用复杂的 `Spring Service`（比如 `WeChatPayService`），怎么办？

我们可以通过枚举持有 `Spring Bean 名称 + ApplicationContext` 动态获取来解耦。

### 方案二：枚举引用 Spring Bean

```java
@Component
public enum PayChannelServiceLocator {
    WECHAT("wechat", "weChatPayService"),
    ALIPAY("alipay", "alipayPayService"),
    BANKCARD("bankcard", "bankCardPayService");

    private final String code;
    private final String beanName;

    PayChannelServiceLocator(String code, String beanName) {
        this.code = code;
        this.beanName = beanName;
    }

    public void pay(BigDecimal amount, ApplicationContext context) {
        PaymentService service = context.getBean(beanName, PaymentService.class);
        service.pay(amount);
    }

    public static PaymentService getService(String code, ApplicationContext context) {
        return Arrays.stream(values())
                .filter(c -> c.code.equals(code))
                .findFirst()
                .map(c -> context.getBean(c.beanName, PaymentService.class))
                .orElseThrow(() -> new IllegalArgumentException("不支持的渠道: " + code));
    }
}
```

注意：这种方式要求你知道 Bean 名称，且依赖 `ApplicationContext`。

更好的做法是——

### 方案三：使用 `Map + @PostConstruct` 注入所有实现（推荐）

```java
@Service
public class PayChannelStrategyService {
    private final Map<String, PaymentService> strategyMap = new HashMap<>();

    public PayChannelStrategyService(List<PaymentService> paymentServices) {
        // 将所有实现按 code 注册到 map
        paymentServices.forEach(service ->
            strategyMap.put(service.getSupportedChannel(), service)
        );
    }

    public void pay(String channel, BigDecimal amount) {
        PaymentService service = strategyMap.get(channel);
        if (service == null) {
            throw new IllegalArgumentException("不支持的支付渠道: " + channel);
        }
        service.pay(amount);
    }
}
```

配合各个实现类：

```java
@Service
public class WeChatPayService implements PaymentService {
    @Override
    public void pay(BigDecimal amount) {
        System.out.println("微信支付: " + amount);
    }

    @Override
    public String getSupportedChannel() {
        return "wechat";
    }
}
```

```java
@Service
public class AlipayPayService implements PaymentService {
    @Override
    public void pay(BigDecimal amount) {
        System.out.println("支付宝支付: " + amount);
    }

    @Override
    public String getSupportedChannel() {
        return "alipay";
    }
}
```

接口定义：

```java
public interface PaymentService {
    void pay(BigDecimal amount);
    String getSupportedChannel();
}
```

此时，调用方完全不需要知道 `if-else`，也不依赖枚举：

```java
@RestController
public class PayController {
    @Autowired
    private PayChannelStrategyService payService;

    @PostMapping("/pay")
    public String pay(@RequestParam String channel, @RequestParam BigDecimal amount) {
        payService.pay(channel, amount);
        return "支付成功";
    }
}
```

#### 优势

- 符合开闭原则
- 易于单元测试
- 扩展新渠道只需新增一个 @Service 实现
- 零 if-else

# 五、错误示范 vs 正确实践：对比更直观

### 反面教材：传统 if-else 写法（千万别再用了）

```java
@Service
public class LegacyPayService {
    public void pay(String channel, BigDecimal amount) {
        if ("wechat".equals(channel)) {
            System.out.println("微信支付: " + amount);
        } else if ("alipay".equals(channel)) {
            System.out.println("支付宝支付: " + amount);
        } else if ("bankcard".equals(channel)) {
            System.out.println("银行卡支付: " + amount);
        } else {
            throw new IllegalArgumentException("不支持的渠道");
        }
    }
}
```

问题：新增渠道要改这里，违反开闭原则；逻辑集中，难维护。

### 正确示范：策略模式 + 枚举或 Map 注册（推荐）

我们用序列图展示初始化过程：

初始化完成后，运行时调用极简：

# 六、最佳实践与避坑指南

**小技巧：为枚举添加 JSON 序列化支持（Jackson）**

```java
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum PayChannel {
    WECHAT("wechat", "微信支付"),
    ALIPAY("alipay", "支付宝");

    private final String code;
    private final String desc;

    PayChannel(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    // getter...
}
```

这样返回给前端时，不再是 "`WECHAT`"，而是：

```json
{
  "code": "wechat",
  "desc": "微信支付"
}
```

# 七、总结：从"写代码"到"设计代码"

`if-else` 不是原罪，但当你发现它开始"生长"成一棵参天大树时，就该警惕了。

通过本文的三个实战案例，你应该已经掌握：

- 如何用枚举封装行为，消灭简单分支；
- 如何结合 Spring 实现运行时策略分发，彻底解耦；
- 如何设计可扩展的业务类型系统，让新增功能不再需要修改旧代码。

记住一句话：

好的代码不是写出来的，是"长"出来的。而枚举，就是让它健康生长的土壤之一。

下次再看到满屏的 `if-else`，别忍了，拿起枚举这把"手术刀"，给你的代码来一次优雅的重构吧。
