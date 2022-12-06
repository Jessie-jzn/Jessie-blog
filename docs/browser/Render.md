---
title: 浏览器的渲染过程：接收到资源后如何渲染页面
author: Jessie
date: "2022-07-11"
---

上文解释了输入URL到服务器返回请求结果的一系列http请求导航流程，这章节来谈谈渲染流程。整体的浏览器渲染流程我也在学习中，可能讲解起来不是特别清晰，希望大家能多提意见。

## 网络进程解析获取到的数据包

响应头中的Content-type来判断响应数据的类型

1. 如果是Content-Type = application/octet-stream字节流类型，就将该请求交给下载管理器
2. 如果是 Content-Type =text/html，就通知浏览器进程获取到文档准备渲染

## 准备渲染进程

浏览器进程判断是否是同一站点
>根据当前页面B是否是从页面A打开的并且和页面A是同一站点（根域名和协议一样就被认为统一站点），如果是则复用之前网页的进程，否则新创建一个单独的渲染进程

## 提交文档

>“文档”指URL请求的响应体数据

[![](https://mermaid.ink/img/pako:eNqrVkrOT0lVslIqTi0sTc1LTnXJTEwvSsyNyXu2tf_F8o6nM1e82D_7-YpuXTu7Zzs2PZs_GcK1UnjaP_FlQ-OjhjnP-ic82bXk2bT2ZwsXP2qY-2T_wmeN64H6kVTrAnU_3zvx-e45cN27dz1f3f1kz4IX-yY_X7fwZePkmDxkFboY9qGZqInmPiQHPV-47sW6JRBnwR2kpKOUm1qUm5iZAvRsdUyegkKMUklGam5qjBLQbKWU1LTE0pySGKWYvFqg0sTSkvzgyrxkJauSotJUHaXSgpTEEljYKFmlJeYUA0VTUzJL8ot8IQEIDsdaAHkRs9I?type=png)](https://mermaid.live/edit#pako:eNqrVkrOT0lVslIqTi0sTc1LTnXJTEwvSsyNyXu2tf_F8o6nM1e82D_7-YpuXTu7Zzs2PZs_GcK1UnjaP_FlQ-OjhjnP-ic82bXk2bT2ZwsXP2qY-2T_wmeN64H6kVTrAnU_3zvx-e45cN27dz1f3f1kz4IX-yY_X7fwZePkmDxkFboY9qGZqInmPiQHPV-47sW6JRBnwR2kpKOUm1qUm5iZAvRsdUyegkKMUklGam5qjBLQbKWU1LTE0pySGKWYvFqg0sTSkvzgyrxkJauSotJUHaXSgpTEEljYKFmlJeYUA0VTUzJL8ot8IQEIDsdaAHkRs9I)

1. 浏览器进程发送“提交文档”给渲染进程
2. 渲染进程接收到消息之后，会和网络进程建立传输数据的通道
3. 文档数据传输完成后，返回“确认提交”的消息给浏览器进程
4. 浏览器进程收到“确认提交”的消息后，更新浏览器的页面状态，包括安全状态、地址栏的URL、前进后退的历史状态，并更新Web页面。**此时web页面是空白**

## 渲染阶段

浏览器接收到http数据包后开始解析

### 1.解析html-词法分析解析成DOM树

输入内容是HTML文件，经过解析器解析最终输出树状结构的DOM

[![](https://mermaid.ink/img/pako:eNqrVkrOT0lVslJKL0osyFDwCYrJUwACx-ina6e_6GqKVdDVtXPSAHKer1mmCZFzAokpOGs82b3keWcPVNAZLOiiAdTzvGnn0_U7X2xcCJVyAUu5akAEn61Y-HReN1BKSUcpN7UoNzEzBWh7NUhpjFJJRmpuaoySFZCZkpqWWJpTEqMUk1cLVJpYWpIfXJmXrGRVUlSaqqNUWpCSWJLqkpkIdHeuklVaYk4xUDQ1JbMkv8gX4iOwx3SUChLzovLzYWpqAd-uWUk?type=png)](https://mermaid.live/edit#pako:eNqrVkrOT0lVslJKL0osyFDwCYrJUwACx-ina6e_6GqKVdDVtXPSAHKer1mmCZFzAokpOGs82b3keWcPVNAZLOiiAdTzvGnn0_U7X2xcCJVyAUu5akAEn61Y-HReN1BKSUcpN7UoNzEzBWh7NUhpjFJJRmpuaoySFZCZkpqWWJpTEqMUk1cLVJpYWpIfXJmXrGRVUlSaqqNUWpCSWJLqkpkIdHeuklVaYk4xUDQ1JbMkv8gX4iOwx3SUChLzovLzYWpqAd-uWUk)

1. 字符编码：先将HTML的原始字节数据转换为文件指定编码的字符
2. 令牌化(Tokenizing)：根据HTML规范将字符串转换成各种令牌
3. 生成节点对象(Lexing)：词法分析将令牌转换为对象并定义属性和规则
4. 构建DOM树(DOM construction)：根据HTML标记关系将对象组成DOM树

### 2.解析css生成css规则树

>继承：每个子节点会默认去继承父节点的样式，如果父节点中找不到，就会采用浏览器默认的样式，也叫UserAgent样式。
>
>层叠：样式层叠，是CSS一个基本特征，它定义如何合并来自多个源的属性值的算法

1. 当渲染引擎接收到CSS文本时，执行转换操作将CSS文本转换为浏览器可以理解结构-styleSheets
2. 转换样式表的属性值，使其标准化，例如em=>px
3. 计算DOM树中每个节点的具体样式，涉及CSS的继承规则和层叠规则，最终输出内容是每个DOM节点的样式并保存在ComputedStyle的结构内

*构建CSSOM树,也就是styleSheets*

1. Tokenizing：字符流转换为标记流
2. Node：根据标记创建节点
3. CSSOM：节点创建CSSOM树

### 3.合并成render树

将独立的对象集合DOM树和CSSOM树结合在一起，构建渲染树

### 4.创建布局树

渲染树构建完成后，需要计算DOM树中可见元素的几何位置，这个阶段就是布局，需要创建布局树和布局计算。

遍历DOM树中的所有可见节点，并把这些节点加到布局中，不可见的节点被忽略。
然后计算布局树节点的坐标位置，生成布局树

### 5.创建分层树

对布局进行分层，生成分层树，为每个图层生成绘制列表，并将其提交到合成线程

1. 分层树
2. 层叠上下文属性的元素单独一层
3. 需要裁剪的单独一层
4. 图层绘制列表

### 6.合成和显示

1. 合成线程将图层分为图块，并在光栅化线程池中将图块转换成位图
2. 合成线程发送绘制图块命令“DrawQuad”给浏览器进程
3. 浏览器进程里面有一个叫 viz 的组件，用来接收合成线程发过来的 DrawQuad 命令，然后根据 DrawQuad 命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。

### 总结

1. 渲染进程将 HTML ➡️ DOM 树
2. 渲染进程将 CSS ➡️styleSheets，计算出 DOM 节点的样式
3. 创建布局树
4. 对布局树进行分层，生成分层树
5. 为每个图层生成绘制列表，并将其提交到合成线程。
6. 合成线程将图层分成图块，并在光栅化线程池将图块➡️位图。
7. 合成线程发送绘制图块命令DrawQuad给浏览器进程。
8. 浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。

## 其他

### GPU绘制

>GUI渲染线程：GUI 渲染线程负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。当界面需要重绘（Repaint）或由于某种操作引发回流（Reflow）时，该线程就会执行。

通常，栅格化过程都会使用 GPU 来加速生成，使用 GPU 生成位图的过程叫快速栅格化，
或者 GPU 栅格化，生成的位图被保存在 GPU 内存中。

#### 重排

>JavaScript 或者 CSS 修改元素的几何位置属性，例如改变元素的宽度、高度等，那么浏览器会触发重新布局，解析之后的一系列子阶段，这个过程就叫重排。重排需要更新完整的渲染流水线

**以下操作会导致重排：**

1. 页面的首次渲染
2. 浏览器的窗口大小发生变化
3. 元素的内容发生变化
4. 元素的尺寸或者位置发生变化
5. 元素的字体大小发生变化
6. 激活CSS伪类
7. 查询某些属性或者调用某些方法
8. 添加或者删除可见的DOM元素

#### 重绘

>如果修改了元素的背景颜色，那么布局阶段将不会被执行，因为并没有引起几何位置的变换，所以就直接进入了绘制阶段，然后执行之后的一系列子阶段，这个过程就叫重绘

**以下操作会导致重排：**

1. color、background 相关属性：background-color、background-image 等
2. outline 相关属性：outline-color、outline-width 、text-decoration
3. border-radius、visibility、box-shadow

#### 优化操作

1. 低层级DOM节点进行操作
2. 不使用table布局
3. 使用CSS的表达式
4. 不频繁操作元素样式，可修改类名，而不是样式
5. 使用absolute或者fixed，使元素脱离文档流，这样他们发生变化就不会影响其他元素
6. 避免频繁操作DOM，可以创建一个文档片段documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中
7. 将元素先设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。
8. 将DOM的多个读操作（或者写操作）放在一起，而不是读写操作穿插着写。这得益于浏览器的渲染队列机制。

>浏览器会将所有的回流、重绘的操作放在一个队列中，当队列中的操作到了一定的数量或者到了一定的时间间隔，浏览器就会对队列进行批处理。这样就会让多次的回流、重绘变成一次回流重绘。

#### 合成

>改了一个既不要布局也不要绘制的属性，那么渲染引擎会跳过布局和绘制，直接执行后续的合成操作，这个过程就叫合成

使用CSS3 的transform、opacity、filter等属性

**好处：**

1. 在合成的情况下，直接跳过布局和绘制流程，进入非主线程处理部分，即直接交给合成线程处理。
2. 充分发挥GPU优势，合成线程生成位图的过程中会调用线程池，并在其中使用GPU进行加速生成，而GPU 是擅长处理位图数据的。
3. 没有占用主线程的资源，即使主线程卡住了，效果依然流畅展示。

### JS引擎解析

> JavaScript引擎线程: JavaScript 引擎线程主要负责解析 JavaScript 脚本并运行相关代码。 JavaScript 引擎在一个Tab页（Renderer 进程）中无论什么时候都只有一个 JavaScript 线程在运行 JavaScript 程序。
>
> **GUI线程与JavaScript引擎线程是互斥的**，这也是就是为什么JavaScript操作时间过长，会造成页面渲染不连贯，导致页面出现阻塞的原理。

---
🔗参考链接：

浏览器工作原理与实践

[你不知道的 Web Workers （上）](https://juejin.cn/post/6844904198639714311)
