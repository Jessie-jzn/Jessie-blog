---
title: 原型链
author: Jessie
date: "2021-12-07"
---

## 概念

1. 由多个元素组成的列表
2. 元素存储不连续，用`next`指针将其连在一起。
3. JavaScript中没有链表这个数据结构，但可以用object去模拟
4. 链表在前端常用于原型和原型链中
5. 数组vs链表
![WX20211207-221838@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed2c8e0744ee49e19de148d835cd3fcb~tplv-k3u1fbpfcp-watermark.image?)

- 数组：一块连续的内存，增删非首尾元素时往往**需要移动元素，时间复杂度O(n)**
- 链表：不是连续内存，增删非首尾元素，**不需要移动元素**，只需要更改 `next` 的指向即可。时间复杂度O(1)

## Object实现链表代码

### 创建链表

```javascript
const a = {val: 'a'}
const b = {val: 'b'}
const c = {val: 'c'}

a.next = b
b.next = c
//用next将链表串起来
```

### 遍历链表

```javascript
// 定义一个指针p，循环把p向后移动一位，p.next = null证明循环完毕
let p = a
while(p){
    console.log(p.val)
    p = p.next
}
```

### 链表中插入新数据

```javascript
// 将前一个数据a的next指向i，将i的next指向下一个b
const i = { val: 'i'}

a.next = i
i.next = b
```

### 链表中删除数据

```javascript
// 将a的next指针指向b的next指向的值c，原来是b.next = c
a.next = c
```

## 原型链

### 原型

> 在js中，每个对象都会在其内部初始化一个属性，这个属性就是原型对象

### 原型链定义

- 当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去 `prototype` 里找这个属性，这个 `prototype` 又会有自己的 `prototype` ，于是就这样一直找下去，这样逐级查找形似一个链条，且通过 `[[prototype]]` 属性连接，这个连接的过程被称为**原型链**。
- 原型链的本质是**链表**，且原型链上的节点是**各种原型对象**，如： `Function.prototype` 、 `Object.prototype` ……。
- 原型链通过 `__proto__` 属性连接各种原型对象。
- `prototype`: 显式原型
- `__ proto__`: 隐式原型

### 常见原型链类型

#### `arr` → `Array.prototype` → `Object.prototype` → `null`

```javascript
let arr = [] // 定义一个对象，间接调用了new Array
arr.__ proto __ === Array.prototype // true
Array.__ proto __=== Object.prototype // ture
Object.__ proto __=== null // true
```

- `arr.__ proto __` 表示arr这个对象的原型（⚠️这个对象不是前端常说的object对象，而是数据结构中的new对象）
- `arr`的原型属性`arr.__ proto __`就是构造函数`Array`的原型对象 `Array.prototype`
- 在 `js` 当中， `Object` 是所有对象的父对象。
- 所以，`Array` 的原型属性 `arr.__proto__.__proto__` = `Object.prototype`
- 由于链表的最后一个结点的`next`指向的是`null`，所以`Object.__ proto __ === null` 也就是`arr.__proto__.__proto__.__proto__` 指向`null` 空值，也就意味着原型链已经走到了最源头的位置
💡 所有原型对象都会**先指向**自己的 `__proto__` 属性，**之后再指向**自己的原型，**最后指向**父对象 `Object` 的原型。

</aside>

#### `obj` → `Object.prototype` → `null`

```javascript
let obj = {};
obj.__proto__ === Object.prototype    //  true
obj.__proto__.__proto__ === null //null
```

#### `func` → `Function.prototype` → `Object.prototype` → `null`

```javascript
let func = function(){
    
};
func.__proto__ === Function.prototype   //  true
func.__proto__.__proto__ === Object.prototype //  true
func.__proto__.__proto__.__proto__ === null  //null
```

#### class中的原型

```javascript
//父类
class People{
    constructor(){
        this.name = name;
    }
    eat(){
        console.log(`${this.name} eat something`);
    }
}

//子类
class Student extends People{
    constructor(name, number){
        super(name);
        this.number = number;
    }
    sayHi(){
        console.log(`姓名：${this.name}，学号：${this.number}`);
    }
}

console.log(typeof Student); //function
console.log(typeof People); //function

let xialuo = new Student('夏洛', 10010);
console.log(xialuo.__proto__);
console.log(Student.prototype);
console.log(xialuo.__proto__ === Student.prototype); //true
```

- `class`实际是函数，也就是语法糖

- 每个 `class` 都有显式原型 `prototype`

- 每个实例都有隐式原型 `__proto__`

- 实例的 `__proto__` 指向对应 `class` 的 `prototype`

- 🤯原型执行规则：

  - 先获取属性（比如 `xialuo.name` 和 `xiaoluo.number` ） 或者获取执行方法 （比如 `xialuo.sayhi()` ）；
  - 获取后，先在自身属性和方法上寻找；
  - 如果找不到则自动去 `__proto__` 中查找。

## `instanceof`原理

> instanceof作用：判断一个实例是否属于某种类型

💡 如果 `A` 沿着原型链能找到 `B.prototype` ，那么 `A instanceof B` 为 `true` 。

```javascript
// 判断A是否为B的实例
const instanceOf = (A, B) => {
    // 定义一个指针P指向A
    let p = A;
    // 当P存在时则继续执行
    while(p){
        // 判断P值是否等于B的prototype对象，是则说明A是B的实例
        if(p === B.prototype){
            return true;
        }
        // 不断遍历A的原型链，直到找到B的原型为止
        p = p.__proto__;
    }
    return false;
}
```

## `typeof` 原理

> `typeof` 能判断`number`, `string`, `object`, `boolean`, `function`, `undefined`, `symbol` 这七种类型，不能判断`null`

原理：通过js底层存储变量的不同来实现

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数
- `null`：所有机器码均为0，直接被当作对象来看，因此无法判断
- `undefined`：用 −2^30 整数来表示

## `Object.prototype.toString` 原理

原理：每种引用类型都会直接或者间接继承`Object`类型，都包含`toString()` 函数，不同数据类型返回值不一样

```javascript
Object.prototype.toString.call(1) // "[object Number]"

Object.prototype.toString.call('hi') // "[object String]"

Object.prototype.toString.call({a:'hi'}) // "[object Object]"

Object.prototype.toString.call([1,'a']) // "[object Array]"

Object.prototype.toString.call(true) // "[object Boolean]"

Object.prototype.toString.call(() => {}) // "[object Function]"

Object.prototype.toString.call(null) // "[object Null]"

Object.prototype.toString.call(undefined) // "[object Undefined]"

Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
```

🔗参考链接：

**[详解链表在前端的应用，顺便再弄懂原型和原型链！](https://juejin.cn/post/6968967150421671973#heading-6)**

**[漫谈前端数据结构——链表](https://juejin.cn/post/6844904136496906254)**
