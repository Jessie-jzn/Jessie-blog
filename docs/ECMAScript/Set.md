---
title: Set类型
author: Jessie
date: "2022-06-08"
---

## 定义

> 本身是一个构造函数，用来生成Set数据结构，可以接受一个数组（具有iterable接口的其他数据结构）作为参数，用来初始化。允许存储任何类型的值，无论是原始值或者是对象引用
>

🧐判断恒等特殊值

- +0 与 -0 在存储判断唯一性的时候是恒等的，所以不重复
- `undefined` 与 `undefined` 是恒等的，所以不重复
- `NaN` 与 `NaN` 是不恒等的，但是在 `Set` 中认为 `NaN` 与 `NaN` 相等，所有只能存在一个，不重复

## 属性及方法

- `size`：返回集合所包含元素的数量
- `add(value)`：添加某个值，返回 `Set` 结构本身(可以链式调用)
- `delete(value)`：删除某个值，删除成功返回 `true`，否则返`false`
- `has(value)`：返回一个布尔值，表示该值是否为 `Set` 的成
- `clear()`：清除所有成员，没有返回值。
- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回键值对的遍历器。每个键和值相等
- `forEach()`：使用回调函数遍历每个成员。

## 优势（相对数组）

> set中的每一项都必须是唯一的
>
- 查看元素
- 删除元素：可以直接使用每项的value来删除该项
- 保存`NaN`：不能使用`indexOf()`或者`includes()`来查找`NaN`，而`Set`可以保存该值
- 删除重复项
- Set的时间复杂度为O(1),而数组为O(n)

### 代码例子

```jsx
let arr = [], set = new Set(), n = 1000000;
for (let i = 0; i < n; i++) {
  arr.push(i);
  set.add(i);
}
```

- 查找元素

    ```js
    let result;
    console.time('Array'); 
    result = arr.indexOf(123123) !== -1; 
    console.timeEnd('Array');
    console.time('Set'); 
    result = set.has(123123); 
    console.timeEnd('Set');
    ```

- 添加元素

    ```javascript
    console.time('Array'); 
    arr.push(n);
    console.timeEnd('Array');
    console.time('Set'); 
    set.add(n);
    console.timeEnd('Set');
    ```

- **删除元素**

    ```jsx
    const deleteFromArr = (arr, item) => {
      let index = arr.indexOf(item);
      return index !== -1 && arr.splice(index, 1);
    };
    
    console.time('Array'); 
    deleteFromArr(arr, n);
    console.timeEnd('Array');
    console.time('Set'); 
    set.delete(n);
    console.timeEnd('Set');
    ```

## 应用

1. `Array.from` 方法可以将 `Set` 结构转为数组
2. 数组去重
3. 数组的 `map` 和 `filter` 方法可以间接用于 `Set`

```jsx
let set = new Set([1, 2, 3])
set = new Set([...set].map((x) => x * 2))
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5])
set = new Set([...set].filter((x) => x % 2 == 0))
// 返回Set结构：{2, 4}
```

1. 实现并集 `(Union)`、交集 `(Intersect)` 和差集

```jsx
let a = new Set([1, 2, 3])
let b = new Set([4, 3, 2])

// 并集
let union = new Set([...a, ...b])
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter((x) => b.has(x)))
// set {2, 3}

// 差集
let difference = new Set([...a].filter((x) => !b.has(x)))
// Set {1}
```

---
🔗参考链接：

[如何使用 Set 来提高JS代码的性能](https://blog.fundebug.com/2019/07/12/speedup-javascript-use-set/)

[你真的了解ES6的Set，WeakSet，Map和WeakMap吗](https://juejin.cn/post/6844904191610060814)
