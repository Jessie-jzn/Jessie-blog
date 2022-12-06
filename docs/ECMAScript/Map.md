---
title: Map类型
author: Jessie
date: "2022-06-08"
---
## Map定义

> 类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，
> 

```jsx
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

## Map和Object的区别

1.  `Object` 对象有原型， 也就是说他有默认的 `key` 值在对象上面， 除非我们使用 `Object.create(null)`创建一个没有原型的对象****
2. 在 `Object` 对象中， 只能把 `String` 和 `Symbol` 作为 `key` 值， 但是在 `Map` 中，`key` 值可以是任何基本类型(`String`, `Number`, `Boolean`, `undefined`, `NaN`….)，或者对象(`Map`, `Set`, `Object`, `Function` , `Symbol` , `null`….)
3. 通过 `Map` 中的 `size` 属性， 可以很方便地获取到 `Map` 长度， 要获取 `Object` 的长度， 你只能手动计算

## 属性及方法

- `size`:返回所包含元素的数量
- `set(key, val)`: 向 `Map` 中添加新元素
- `get(key)`: 通过键值查找特定的数值并返回
- `has(key)`: 判断 `Map` 对象中是否有 `Key` 所对应的值，有返回 `true`，否则返回 `false`
- `delete(key)`: 通过键值从 `Map` 中移除对应的数据
- `clear()`: 将这个 `Map` 中的所有元素删除
- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

## 转化

```jsx
// Map 转为数组
let map = new Map()
let arr = [...map]

// 数组转为 Map
Map: map = new Map(arr)

// Map 转为对象
let obj = {}
for (let [k, v] of map) {
  obj[k] = v
}

// 对象转为 Map
for( let k of Object.keys(obj)）{
  map.set(k,obj[k])
}
```

## 应用

例如个人信息的展示，通过Map 来改造，将我们需要显示的 label 和 value 存到我们的 Map 后渲染到页面，这样减少了大量的html代码

```jsx
<div class="info-item">
  <span>姓名</span>
  <span>{{info.name}}</span>
</div>
<div class="info-item">
  <span>年龄</span>
  <span>{{info.age}}</span>
</div>
<div class="info-item">
  <span>性别</span>
  <span>{{info.sex}}</span>
</div>
<div class="info-item">
  <span>手机号</span>
  <span>{{info.phone}}</span>
</div>
<div class="info-item">
  <span>家庭住址</span>
  <span>{{info.address}}</span>
</div>
<div class="info-item">
  <span>家庭住址</span>
  <span>{{info.duty}}</span>
</div>
```

```jsx
import "./styles.css";

export default function App() {
  let infoMap = {};

  const info = {
    name: "jack",
    sex: "男",
    age: "28",
    phone: "13888888888",
    address: "广东省广州市",
    duty: "总经理"
  };
  const mapKeys = ["姓名", "性别", "年龄", "电话", "家庭地址", "身份"];
  let result = new Map();
  let i = 0;
  for (const key in info) {
    result.set(mapKeys[i], info[key]);
    i++;
  }
  infoMap = result;
  console.log([...infoMap]);

  return (
    <div className="App">
      {[...infoMap].map((item) => (
        <>
          <span>{item[0]}</span>
          <span>{item[1]}</span>
        </>
      ))}
    </div>
  );
}
```

## WeakMap

`WeakMap` 结构与 `Map` 结构类似，也是用于生成键值对的集合。

- 只接受对象作为键名（`null` 除外），不接受其他类型的值作为键名
- 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
- 不能遍历，方法有 `get`、`set`、`has`、`delete`

---
🔗参考链接：

[你真的了解ES6的Set，WeakSet，Map和WeakMap吗？](https://juejin.cn/post/6844904191610060814)