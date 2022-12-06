---
title: WeakSet类型
author: Jessie
date: "2022-06-08"
---

## 定义

> 结构与Set类似，不重复的值的集合
>

💡WeakSet 的成员只能是对象，而不能是其他类型的值

🧐特点：WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

- 如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中
- WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。
- 不可遍历⚠️
- 用来存这个对象相关的数据,与数据共存亡

## 方法

- `add(value)`：添加某个值
- `delete(value)`：删除某个值，删除成功返回 `true`，否则返`false`
- `has(value)`：返回一个布尔值

## 应用

1. 储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏

    ```jsx
    <div id="root">
       <button id="btn">11111</button>
    </div>
    
    <script>
      let wrap = document.getElementById("root");
      let btn = document.getElementById("btn");
      let element = new WeakSet();
      console.log("btn", btn, wrap);
      element.add(btn);
      btn.addEventListener("click", () => {
        wrap.removeChild(btn);
        console.log("element", element);
      });
    </script>
    ```

    🔧tip：这里当 button 被移除，disabledElements 中的内容会因为是弱引用而直接变成空，也就是disabledElements被垃圾回收掉了其中的内存，避免了一个小小的内存泄漏的产生

2. 一个用户对象作为键，其访问次数为值。当一个用户离开时（该用户对象将被垃圾回收机制回收），这时我们就不再需要他的访问次数了

    ```jsx
    let visitsCountMap = new WeakMap()
    
    // 递归用户来访次数
    function countUser(user){
     let count = visitsCountMap.get(user) || 0
        visitsCountMap.set(user, count + 1)
    }
    
    // 📁 main.js
    let john = { name: "John" };
    countUser(john); // count his visits
    // 不久之后，john 离开了
    john = null;
    ```

3. 缓存计算的结果

    ```jsx
    let cache = new WeakMap()
    
    // 与obj 嘻嘻相关的结果
    function process(obj){
     if(!cache.has(obj)) {
         let result = `与obj有关的计算`
            cache.set(obj, result)
        }
        return cache.get(obj)
    }
    
    // other.js
    let obj = {}
    let result1 = process(obj)
    let result2 = process(obj)
    obj = null // 如果是Map 就cache 里不可被回收
    ```

---
🔗参考链接：

[Map Set WeakMap WeakSet 场景](https://juejin.cn/post/6925320069522128909)
