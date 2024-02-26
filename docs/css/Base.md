---
title: CSS 基础
author: Jessie
date: "2024-02-26"
---

## 伪类

CSS伪类是一种CSS选择器，用于选择元素的特定状态或位置，而不是根据元素的类名或标签名进行选择。常见的CSS伪类包括：

- :hover：选择鼠标悬停在元素上方时的状态。
- :active：选择元素处于激活状态时（例如，用户点击元素但尚未释放鼠标按钮时）的状态。
- :focus：选择当前拥有焦点的元素（例如，通过键盘或鼠标聚焦到表单元素上时）。
- :first-child：选择作为其父元素的第一个子元素的元素。
- :last-child：选择作为其父元素的最后一个子元素的元素。
- :nth-child()：选择作为其父元素的指定顺序（通过表达式进行计算）的子元素。
- :nth-of-type()：选择作为其父元素的指定类型（通过标签名进行指定）的元素中的指定顺序的元素。
- :not()：选择不匹配指定选择器的元素。
- :first-of-type：选择作为其父元素的指定类型的元素中的第一个元素。
- :last-of-type：选择作为其父元素的指定类型的元素中的最后一个元素。

## 继承与层叠

**继承（Inheritance）：**
CSS中的继承指的是子元素可以继承父元素的某些样式属性。例如，文字颜色和字体大小通常会被子元素继承自其父元素。但并非所有样式属性都可以被继承，只有一部分特定的属性才能被继承。

**层叠（Cascading）：**
CSS中的层叠指的是当多个样式规则应用于同一个元素时，浏览器根据一定的优先级和规则来确定最终生效的样式。层叠规则主要包括以下几个方面：
    - **特指性（Specificity）：** 根据选择器的特指性来决定优先级，特指性越高的样式规则优先级越高。
    - **来源（Origin）：** 根据样式表的来源来确定优先级，内联样式优先级最高，其次是嵌入样式表和外部样式表。
    - **顺序（Order）：** 根据样式表中规则的顺序来决定优先级，后定义的规则会覆盖前面定义的规则。

## 优先级计算

优先级由选择器的特定性（Specificity）和重要性（Importance）决定。一般来说，具有更高特定性和/或更高重要性的样式规则将覆盖具有较低特定性和/或较低重要性的规则。

以下是CSS优先级的计算规则：

- 特定性： 特定性是指CSS选择器的权重，用于确定哪个样式规则优先应用于元素。特定性通常用四个值（a，b，c，d）表示，其中a、b、c、d分别代表以下四个部分的值：
  - a：行内样式（Inline styles）的特定性，权值为1000。
  - b：ID选择器的数量。每个ID选择器增加100的特定性值。
  - c：类选择器、属性选择器和伪类选择器的数量。每个类选择器、属性选择器或伪类选择器增加10的特定性值。
  - d：元素选择器和伪元素选择器的数量。每个元素选择器或伪元素选择器增加1的特定性值。
- 重要性： 重要性是通过在样式规则中使用!important关键字来声明的。带有!important关键字的样式规则具有更高的优先级，将覆盖其他具有相同特定性的规则。

当两个或多个样式规则应用于同一个元素时，根据以下规则计算它们的优先级：

- 比较两个样式规则的特定性。特定性值较高的规则具有更高的优先级。
- 如果两个样式规则的特定性相同，则比较它们的重要性。带有!important关键字的规则具有更高的优先级。
- 如果两个样式规则的特定性和重要性都相同，则根据它们在样式表中的顺序来确定优先级。后面出现的规则将覆盖先前的规则。

举例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSS优先级示例</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div id="example" class="box">Example</div>
</body>
</html>

```

```css
/* styles.css */
#example {
    color: blue; /* 特定性：ID选择器，特定性值为100 */
}

.box {
    color: red; /* 特定性：类选择器，特定性值为10 */
}

div {
    color: green !important; /* 重要性：带有!important关键字 */
}

```

根据上述CSS样式，可以分析每个样式规则的特定性和重要性：

- #example选择器具有ID选择器，特定性值为100。
- .box选择器具有类选择器，特定性值为10。
- div选择器具有元素选择器，特定性值为1，并且带有!important关键字。

因此，根据特定性和重要性的计算规则，div元素应用的样式将是绿色的，因为它具有最高的优先级。即使#example和.box选择器也应用了颜色样式，但由于它们的特定性较低，且没有!important关键字，因此被覆盖了。

## 定位布局

1. **相对定位（Relative Positioning）：** 使用`position: relative;`可以相对于元素在文档流中的原始位置进行定位。通过设置`top` `right` `bottom` `left`属性来调整元素的位置，但它仍然占据着文档流中的原始空间，对其他元素的布局没有影响。
2. **绝对定位（Absolute Positioning）：** 使用`position: absolute;`可以脱离文档流，并相对于最近的具有定位属性的祖先元素进行定位。如果没有找到定位的祖先元素，则相对于文档的初始包含块进行定位。通常与`top`、`right`、`bottom`、`left`**属性一起使用来精确定位元素。
3. **固定定位（Fixed Positioning）：** 使用`position: fixed;`可以将元素固定在视口的某个位置，不随页面的滚动而移动。通常用于创建固定在屏幕顶部或底部的导航栏或工具栏。
4. **粘性定位（Sticky Positioning）：** 使用`position: sticky;`可以在滚动到达特定位置时将元素固定在页面上。元素在滚动到达指定位置前将保持正常布局，一旦滚动超过指定位置，则元素将固定在指定位置
5. **Flexbox布局：** 适用于需要灵活布局的情况，例如创建水平或垂直居中的布局、等高的列布局或者响应式布局。
6. **Grid布局：** 适用于需要复杂网格结构的情况，例如创建多列等宽布局、区域划分布局或者复杂的网格结构。

### 垂直水平居中实现代码

#### 使用Flexbox

```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

```

#### 使用绝对定位和transform属性

```css
.container {
  position: relative;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

```

#### 使用Grid布局

```css
.container {
  display: grid;
  place-items: center; /* 同时实现水平和垂直居中 */
}
```

#### 使用表格布局

```css
.container {
  display: table-cell;
  text-align: center; /* 水平居中 */
  vertical-align: middle; /* 垂直居中 */
}

```
