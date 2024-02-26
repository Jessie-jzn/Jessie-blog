---
title: 宏任务与微任务
author: Jessie
date: "2024-02-26"
---

## 宏任务（Macro Task）

宏任务是由浏览器发起的任务，通常包括以下几种情况：

- 定时器任务（setTimeout、setInterval等）
- 事件监听器回调函数（如点击事件、鼠标移动事件等）
- I/O操作（读写文件等）
- 页面渲染（解析HTML、执行JavaScript、渲染页面等）

## 微任务（Micro Task）

微任务是在宏任务执行完毕后立即执行的任务，优先级高于宏任务。微任务通常包括以下几种情况：

- Promise的then方法注册的回调函数
- MutationObserver的回调函数
- process.nextTick（在Node.js环境中）

## 事件循环

在事件循环（Event Loop）中，当一个宏任务执行完毕后，会检查是否存在微任务队列。如果存在微任务，则会依次执行微任务队列中的任务，直到微任务队列为空。然后再执行下一个宏任务。这样，微任务可以在当前任务执行完毕后立即执行，不会延迟到下一个宏任务执行时。

### 例子

```javascript
console.log('Start'); 

setTimeout(function() {
  console.log('setTimeout callback'); 
}, 0);

Promise.resolve().then(function() {
  console.log('Promise resolved'); 
});

console.log('End'); 

```

事件循环的执行顺序如下：

1. 输出Start
2. 输出End
3. 执行Promise中的then方法注册的回调函数，输出Promise resolved
4. 执行setTimeout中的回调函数，输出setTimeout callback

这个示例展示了事件循环的基本流程：同步任务优先于微任务（Promise.then注册的回调函数），微任务优先于宏任务（setTimeout注册的回调函数）。

```js
console.log('Start'); 

setTimeout(function() {
  console.log('setTimeout callback'); 
}, 0);

Promise.resolve().then(function() {
  console.log('Promise resolved 1'); 
}).then(function() {
  console.log('Promise resolved 2'); 
});

console.log('End'); 

Promise.resolve().then(function() {
  console.log('Promise resolved 3'); 
});

```

在这个示例中，事件循环的执行顺序如下：

1. 输出Start
2. 输出End
3. 执行第一个Promise中的then方法注册的回调函数，输出Promise resolved 3
4. 执行第二个Promise中的then方法注册的回调函数，输出Promise resolved 1
5. 执行第二个Promise中的then方法注册的回调函数，输出Promise resolved 2
6. 执行setTimeout中的回调函数，输出setTimeout callback
