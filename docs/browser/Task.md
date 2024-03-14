---
title: 浏览器的事件循环
author: Jessie
date: "2024-02-26"
---
## 概念

事件循环是指浏览器处理各种事件（如用户输入、网络请求、定时器等）的机制。它是浏览器中的一个重要组成部分，负责管理和调度各种异步任务的执行顺序。

## 组成部分

- **主线程（Main Thread）**：负责执行 JavaScript 代码、处理 DOM 操作和渲染等任务。所有的 JavaScript 代码都是在主线程上执行的。
- **任务队列（Task Queue）**：用于存放各种异步任务的回调函数。主线程执行完同步任务后，会不断地从任务队列中取出任务执行，直到任务队列为空。
- **微任务队列（Microtask Queue）**：用于存放微任务，微任务队列的优先级高于任务队列，在主线程执行完当前任务后，会首先清空微任务队列中的任务。
  - MutationObserver
  - Promise 的 `then()` 或 `catch()`
  - V8 引擎的垃圾回收过程
  - Node.js 的 `process.nextTick`
- **宏任务队列（Macro Task Queue）**：存放在任务队列（Task Queue）中，宏任务队列的优先级低于微任务队列。
  - script
  - setTimeout
  - setInterval
  - setImmediate
  - I/O
  - UI 渲染

## 事件循环执行顺序

1. JavaScript 开始执行时，整个脚本作为一个宏任务执行，对于同步代码直接压入执行栈进行执行。
2. 执行过程中，同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列。
3. 当前宏任务执行完毕出队，然后检查微任务队列，如果存在微任务，则依次执行微任务，直到微任务队列为空。
4. 执行浏览器 UI 渲染工作。
5. 检查是否有 Web Worker 任务需要执行，如果有，则执行。
6. 执行完当前轮次的宏任务后，回到步骤 2，依此循环，直到宏任务队列和微任务队列都为空。

>Web Worker 任务：在浏览器中运行的 JavaScript 脚本，可以在后台运行，独立于主线程用于执行一些耗时的计算或处理大量数据的任务，以提高页面的响应速度和性能。Web Worker 可以在不阻塞主线程的情况下执行，并且可以与主线程进行通信。它可以用于大量计算、大量数据处理、后台数据加载、长时间运行的任务等场景。

## 示例题解析

```javascript
console.log(1);
async function first() {
  console.log(2);
}
setTimeout(() => {
  console.log(3);
}, 0);
Promise.resolve().then(() => {
  console.log(4);
});
new Promise((resolve, reject) => {
  console.log(5);
  resolve();
}).then((res) => {
  console.log(6);
});
first();
console.log(7);

```

- `console.log(1);`：同步任务，输出 1。
- `async function first() { console.log(2); }`：定义了一个异步函数 `first`，但不会立即执行。
- `setTimeout(() => { console.log(3); }, 0);`：通过 `setTimeout` 注册了一个定时器，但因为时间设为 0，所以会被放入任务队列中，不会立即执行。
- `Promise.resolve().then(() => { console.log(4); });`：`Promise` 的 `then` 方法是微任务，会在当前任务执行完成后立即执行，输出 4。
- `new Promise((resolve, reject) => { console.log(5); resolve(); }).then((res) => { console.log(6); });`：创建了一个 Promise 实例，因为 `Promise` 的执行是立即的，所以会输出 5，而后面的 `then` 方法是微任务，输出 6。
- `first();`：调用异步函数 `first()`。
- `console.log(7);`：同步任务，输出 7。

## 注意点

1. 如果`async`函数中没有await执行体，则相当于返回一个`Promise`实例，直接执行
2. 如`async`函数体存在`await`执行体，先执行`await`里的异步函数，等待执行完后再执行回原来函数的后续操作，可以当作`await`后面的内容是放到了`Promise.then`的里面
3. `Promise`的状态一旦改变就无法改变
4. `async`函数中`await`的`new Promise`要是没有返回值的话则不执行后面的内容
5.`Promise.then`函数中的参数期待的是函数，如果不是函数的话会发生透传
