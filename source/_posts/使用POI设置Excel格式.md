---
title: 使用poi设置一些excel的格式
description: 🖼️导出表格以及设置一些excel格式的用法
mathjax: true
tags:
  - "#poi"
  - "#导出excel格式"
categories:
  - 随手笔记
abbrlink: "20241111"
sticky: 2
swiper_index: 2
date: 2024-11-09T15:19:00
updated: 2024-11-11T15:44:00
cover: 设置封面(填写URL地址即可)
---

# 使用 POI 设置 Excel 格式

## POI 的使用

阿帕奇的一个框架，不知道的自行百度一下吧。

先说下都有哪些创建方式，以及各个的区别吧。POI的一些使用方法：

- 创建流程（上级为下级的载体）：
  1. 创建Workbook（工作薄）；
  2. 创建Sheet（[表单](https://so.csdn.net/so/search?q=%E8%A1%A8%E5%8D%95&spm=1001.2101.3001.7020)，可以创建多个）；
  3. 创建Row（行）；
  4. 创建Cell（单元格）

接下来分别说下工作簿的常用三种形式的区别，他们分别是 1.HSSFWorkbook 2.XSSFWorkbook 3.SXSSFWorkbook：

- 第一种：HSSFWorkbook
  - 针对是 EXCEL2003 版本，扩展名为 .xls；所以此种的局限就是导出的行数至多为 65535 行，
  - 此种因为行数不足七万行所以一般不会发生内存不足的情况（OOM）；

- 第二种：XSSFWorkbook
  - 这种形式的出现是由于第一种HSSFWorkbook的局限性而产生的，因为其所导出的行数比较少，所以XSSFWookbook应运而生，其对应的是EXCEL2007+（1048576行，16384列）扩展名.xlsx，最多可以导出104万行，不过这样就伴随着一个问题——OOM 内存溢出，原因是你所创建的book、sheet、row、cell等此时是存在内存的并没有持久化，那么随着数据量增大，内存的需求量也就增大，那么很大可能就是要OOM了，那么怎么解决呢？

- 第三种：SXSSFWorkbook（poi.jar 3.8+）
  - 第二种遇到的问题该如何解决呢？因为数据量过大导致内存吃不消那么可以让内存到量持久化吗？答案是肯定的，此种的情况就是设置最大内存条数，比如，设置最大内存量为5000 rows——new SXSSFWookbook（5000），此时当行数达到5000时，把内存持久化写到文件中，以此逐步写入避免OOM，那么这样就完美解决了大数据下导出的问题。

```java
//创建一个sheet对象
XSSFWorkbook workbook = new XSSFWorkbook();
Sheet sheet = workbook.createSheet();
// 创建标题行
Row rowHeader = sheet.createRow(0);
//创建第一行第一列
Cell cell = rowHeader.createCell(0, CellType.STRING);
//设置第一列的值
cell.setCellValue("报表");
```

这些是设置行列的用法，循环组合起来就可以写入报表具体数据，最后面会放一个demo。

vue使用axios请求后端去返回下载流这种，必须使用==responseType: 'blob'==：

```javascript
export: params => {
    return Axios.post(`${api}report/exportreport`, params, {
        responseType: 'blob'
    })
},
```

vue写法：

```javascript
buSupportSevConfig.export(params).then(res => {
    // 创建一个新的 URL 对象，并生成一个下载链接
    const url = window.URL.createObjectURL(new Blob([res.data],
        { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '综合查询结果导出表.xlsx'); // 设置下载的文件名
    link.style.display = 'none' // 隐藏元素
    document.body.appendChild(link);
    link.click();

    // 清理 DOM 和释放 URL 对象
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
})
```

后端写法：

```java
response.setContentType("application/vnd.ms-excel");
String resultFileName = URLEncoder.encode(fileName, "UTF-8");
response.setHeader("Content-disposition", "attachment;filename=" + resultFileName + ";" + "filename*=utf-8''" + resultFileName);
workbook.write(response.getOutputStream());
workbook.close();
response.flushBuffer();
```

## 设置 Excel 格式

### 合并单元格

```java
// 设置单元格合并
CellRangeAddress region = new CellRangeAddress(0, 0, 0, headerList.size()); // 合并第一行第一列到第二列
sheet.addMergedRegion(region);
```

### 带斜线的单元格

这里给一种简单的写法，复杂表格画斜线最好使用这种[Java中使用POI在Excel单元格中画斜线—XLS格式 - 简书](https://www.jianshu.com/p/c03f844fd950)：

```java
XSSFSheet sheet = wb.createSheet("Sheet1");
CreationHelper helper = wb.getCreationHelper();
XSSFDrawing drawing = sheet.createDrawingPatriarch();
Row rowHeadertou = sheet.createRow(1);
ClientAnchor anchor = helper.createClientAnchor();
// 设置斜线的开始位置
anchor.setCol1(0);
anchor.setRow1(1);
// 设置斜线的结束位置
anchor.setCol2(1);
anchor.setRow2(2);
XSSFSimpleShape shape = drawing.createSimpleShape((XSSFClientAnchor) anchor);
// 设置形状类型为线型
shape.setShapeType(ShapeTypes.LINE);
// 设置线宽
shape.setLineWidth(0.5);
// 设置线的风格
shape.setLineStyle(0);
// 设置线的颜色
shape.setLineStyleColor(0, 0, 0);
```

效果就是这种：

![单元格示例](/images/danyuange.png)

需要调整宽和高：

```java
//调整高宽必须是在生成具体的行之后 否则无效
//调整宽度 前面的i代表第几行
sheet.setColumnWidth(i, 50 * 100);
//设置高度
rowHeadertou.setHeight((short)(18*45));
```

### 设置边框、字体、加粗、居中等

```java
//创建 样式
XSSFWorkbook workbook = new XSSFWorkbook();
CellStyle style = workbook.createCellStyle();
//设置文字水平居中对齐,垂直对齐
style.setAlignment(HorizontalAlignment.CENTER);
style.setVerticalAlignment(VerticalAlignment.CENTER);
//创建字体
Font titleFont = workbook.createFont();
//设置字体的名称(例如Arial)
titleFont.setFontName("宋体");
//以1/20点为单位设置字体高度。
titleFont.setFontHeight((short) 10);
//颜色设置
titleFont.setColor((short) 111);
//是否加粗
titleFont.setBold(true);
//设置字体高度
titleFont.setFontHeightInPoints((short) 12);
style.setFont(titleFont);
//设置边框 THICK是加粗边框,thic是普通边框
style.setBorderBottom(BorderStyle.THICK);
style.setBorderRight(BorderStyle.THICK);
style.setBorderTop(BorderStyle.THICK);
```

**边框这种东西如果用代码设置会非常麻烦，所以如果有复杂的单元格设置或者表头的，最好是使用模板，就是先创建一个设置好的模板，然后用代码去复制一个模板文件，读取模板，往里面写入数据。**

### 基于模板导出的工具类

```java
package com.cars.tsbdas.common;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName: ExcelUtils * @Description: 导入、导出
 */

//@PropertySource(value = {"classPath:excel.properties"} )
@RestController
public class ExcelUtils {

    private static final long serialVersionUID = 1L;

    private static final Logger logger = LoggerFactory.getLogger(ExcelUtils.class);

    public static final String SUCCESS = "success";

    public static final String FAIL = "fail";

    //导出文件模板路径
    private static String templatePath;

    //导出文件路径
    private static String exportPath;


    /**
     * 生成excel并下载
     *
     * @param response 响应
     * @param fileName 导出文件名
     * @param path 导出路径
     * @param sheetNum  开始页签
     * @param createRowNum  开始行
     * @param createCellNum  开始列
     */
    public static void exportExcel(List<List<List<String>>> result, HttpServletResponse response, String fileName, int sheetNum, int createRowNum, int createCellNum) {

       File newFile = createNewFile(fileName);
       // 新文件写入数据，并下载*****************************************************
       InputStream is = null;
       XSSFWorkbook workbook = null;
       XSSFSheet sheet = null;
       try {
          is = new FileInputStream(newFile);// 将excel文件转为输入流
          workbook = new XSSFWorkbook(is);// 创建个workbook，
          if (result.size() > 0) {
             for (int i = 0; i < result.size(); i++) {
                sheet = workbook.getSheetAt(i);
                ExcelUtils.writeIOData(result.get(i), newFile, workbook, sheet, createRowNum, createCellNum);
             }
          }
          // 下载
          InputStream fis = new BufferedInputStream(new FileInputStream(newFile));
          byte[] buffer = new byte[fis.available()];
          fis.read(buffer);
          fis.close();
          response.reset();
          response.setContentType("text/html;charset=UTF-8");
          OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
          response.setContentType("application/x-msdownload");
          String newName = URLEncoder.encode(fileName + System.currentTimeMillis() + ".xlsx", "UTF-8");
          response.addHeader("Content-Disposition", "attachment;filename=\"" + newName + "\"");
          response.addHeader("Content-Length", "" + newFile.length());
          toClient.write(buffer);
          toClient.flush();
          toClient.close();
       } catch (Exception e1) {
          e1.printStackTrace();
          logger.error("readExcel" + ExcelUtils.FAIL, e1);
       } finally {
          try {
             if (null != is) {
                is.close();
             }
          } catch (Exception e) {
             e.printStackTrace();
          }
       }
    }

    /**
     * 开始往excel表中写数据
     *
     * @param newFile 导出文件名
     * @param createRowNum  开始行
     * @param createCellNum  开始列
     * @throws IOException
     */
    private static void writeIOData(List<List<String>> result, File newFile, XSSFWorkbook workbook, XSSFSheet sheet,
          int createRowNum, int createCellNum) throws IOException {
       // 写数据
       FileOutputStream fos = new FileOutputStream(newFile);
       XSSFRow row = sheet.getRow(createRowNum);
       if (row == null) {
          row = sheet.createRow(createRowNum);
       }
       XSSFCell cell = row.getCell(createCellNum);
       if (cell == null) {
          cell = row.createCell(createCellNum);
       }
       int cellNum = result.get(0).size();
       for (int m = 1; m < result.size(); m++) {
          row = sheet.createRow((int) m + 1);
          List<String> tempList = result.get(m);
          for (int i = 0; i < cellNum; i++) {
             String str = tempList.get(i);
             cell = row.createCell(i);
             cell.setCellValue(str);
          }
       }
       workbook.write(fos);
       fos.flush();
       fos.close();
    }


    /**
     * 复制文件
     * @param s 源文件
     * @param t 复制到的新文件
     */

    public static void fileChannelCopy(File s, File t) {
       try {
          InputStream in = null;
          OutputStream out = null;
          try {
             in = new BufferedInputStream(new FileInputStream(s), 1024);
             out = new BufferedOutputStream(new FileOutputStream(t), 1024);
             byte[] buffer = new byte[1024];
             int len;
             while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
             }
          } finally {
             if (null != in) {
                in.close();
             }
             if (null != out) {
                out.close();
             }
          }
       } catch (Exception e) {
          logger.error("templateFile copy exportFile" + ExcelUtils.FAIL, e);
          e.printStackTrace();
       }
    }
    /**
     * 获取根路径
     * @return
     */
    private static String getSispPath() {
       String classPaths = ExcelUtils.class.getResource("/").getPath();
       String[] aa = classPaths.split("/");
       String sispPath = "";
       for (int i = 1; i < aa.length - 2; i++) {
          sispPath += aa[i] + "/";
       }
       return sispPath;
    }

    /**
     * 读取excel模板，并复制到新文件中供写入和下载
     *
     * @return
     */
    public static File createNewFile(String fileName) {
       // 读取模板，并赋值到新文件************************************************************
       String path = (getSispPath() + templatePath +"/" + fileName +".xlsx");
       File file = new File(path);
       // 保存文件的路径
       String realPath = (getSispPath() + exportPath +"/");
       // 判断路径是否存在
       File dir = new File(realPath);
       if (!dir.exists()) {
          dir.mkdirs();
       } else {
          ExcelUtils.deleteFile(dir.listFiles());
          logger.info("delete exportFile" + ExcelUtils.SUCCESS);
       }
       // 写入到新的excel
       File newFile = new File(realPath, fileName);
       try {
          newFile.createNewFile();
          // 复制模板到新文件
          fileChannelCopy(file, newFile);
       } catch (Exception e) {
          e.printStackTrace();
       }
       return newFile;
    }

    /**
     * 下载成功后删除
     *
     * @param files
     */
    private static void deleteFile(File... files) {
       for (File file : files) {
          if (file.exists()) {
             file.delete();
          }
       }
    }

    @Value("${template.path}")
    public void setTemplatePath(String templatePath) {
       ExcelUtils.templatePath = templatePath;
    }

    @Value("${export.path}")
    public void setExportPath(String exportPath) {
       ExcelUtils.exportPath = exportPath;
    }
}
```

### 基于类反射生成 Excel 文件的工具类

如果数据是动态组合，那就不能用这种class反射方式去生成列：

```java
/**
 * 数据导出
 *
 * @param fileName 导出excel名称
 * @param data     导出的数据  通过实体类去反射得到头部名字
 * @param c        导出数据的实体class
 * @param response 响应
 * @throws Exception
 */
public static void exportExcel(String fileName, List<?> objects, Class<?> c, HttpServletResponse response) throws Exception {
    try {
        // 创建表头
        // 创建工作薄
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet();
        // 创建表头行
        Row rowHeader = sheet.createRow(0);
        if (c == null) {
            throw new RuntimeException("Class对象不能为空!");
        }
        Field[] declaredFields = c.getDeclaredFields();
        List<String> headerList = new ArrayList<>();
        if (declaredFields.length == 0) {
            return;
        }

        for (int i = 0; i < declaredFields.length; i++) {
            Cell cell = rowHeader.createCell(i, CellType.STRING);
            String headerName = String.valueOf(declaredFields[i].getName());
            cell.setCellValue(headerName);
            headerList.add(i, headerName);
        }
        // 填充数据
//            List<?> objects = JSONObject.parseArray(data, c);
//            List<?> objects =;
        Object obj = c.newInstance();
        if (!CollectionUtils.isEmpty(objects)) {
            for (int o = 0; o < objects.size(); o++) {
                Row rowData = sheet.createRow(o + 1);
                for (int i = 0; i < headerList.size(); i++) {
                    Cell cell = rowData.createCell(i);
                    Field nameField = c.getDeclaredField(headerList.get(i));
                    nameField.setAccessible(true);
                    String value = String.valueOf(nameField.get(objects.get(o)));
                    cell.setCellValue(value);
                }
            }
        }

        response.setContentType("application/vnd.ms-excel");
        String resultFileName = URLEncoder.encode(fileName, "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + resultFileName + ";" + "filename*=utf-8''" + resultFileName);
        workbook.write(response.getOutputStream());
        workbook.close();
        response.flushBuffer();
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```
