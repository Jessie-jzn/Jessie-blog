---
title: 函数防抖与节流
author: Jessie
date: "2024-02-27"
---

>防抖和节流是两种常用的性能优化技术，用于限制函数的执行频率，从而提高页面性能和用户体验。

## 防抖（Debounce）

### 概念

> 事件被触发 n 秒之后再执行回调，如果在这 n 秒内事件又被触发，则重新计时
>
> 通过 function 闭包原理，缓存了`timer`变量，然后通过`clearTimeout`清除冗余操作

### 使用场景

1. 按钮提交：防⽌多次提交按钮，只执⾏最后提交的⼀次
2. 服务端验证：表单验证需要服务端配合，只执⾏⼀段连续的输⼊事件的最后⼀次，搜索联想词功能等

### 基础代码

```javascript
function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

const debouncedFunc = debounce(() => {
  console.log('防抖函数执行了');
}, 300);

// 在输入框输入时触发防抖函数
input.addEventListener('input', debouncedFunc);

```

### useDebounce

```javascript
import { useCallback } from 'react'

type noop = (...args: any[]) => any

const useDebounce = <T extends noop>(fn: T, wait: number) => {
  const debounce = (...args: any[]) => {
    let timer = null

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }

  const memoDebounce = useCallback(debounce, [])

  return memoDebounce
}
export default useDebounce
```

## 节流

### 概念

> 在一段时间内只执行一次触发事件

### 使用场景

1. 拖拽:固定时间内只执⾏⼀次，防⽌超⾼频次触发位置变动
2. 缩放:监控浏览器resize
3. 动画:避免短时间内多次触发动画引起性能问题

### 基础代码

#### 使用时间戳进行比较

```javascript
const throttle = (fn,wait=0) => {
    let preTime =0 // 不能使用new Date(),否则第一次会不执行

    return (...args) => {
        const curTime = +new Date()

        if(curTime - preTime >= wait){ // 判断是否在事件间隔内
            fn.apply(this, args)
            preTime = curTime
        }
    }         
}
```

#### 使用定时器

```javascript
const throttle = (fn,wait=0) => {
    let timer = null

    return (...args) => {
        if(!timer) { // 判断是否有定时器
            fn.apply(this, args)
            timer = setTimeout(() => {
                timer = null
            },wait)
        }
    }         
}
```

### React使用踩坑记

1. 不生效
2. input框的参数获取不到
3. input框中使用throttle，在间隔时间内最后一次不执行，导致显示不正确

#### 原因

在React Hook函数组件中使用防抖时发现并不生效，主要原因在于函数式组件在每一次渲染之后所有的变量和函数都会被释放，在重新渲染的时候重新初始化，也就是说闭包所缓存的变量没有用了，导致throttle和debounce不生效

#### 错误代码

```javascript
const ThrottleBox = () => {
    const [val,setVal]=useState('')

    const throttle = (fn,wait=0) => {
        let timer = null

        return () => { // 没有接受函数的参数
            if(!timer) {
                fn() 
                timer = setTimeout(() => {
                    timer = null
                },wait)
            }
        }         
    }
    const handleSave =throttle((e) => { // 函数重新渲染了，导致闭包内的变量也发生改变
        setVal(e.target.value)
    },500),[]
       
    return <>
        <Input onChange={handleSave} /> 
        <span>输入框的值是：{val}</span>
    </>


}
export default ThrottleBox

```

### 升级版代码

```javascript
const ThrottleBox = () => {
    const [val,setVal]=useState('')

    const throttle = (fn,wait=0) => {
        let preTime =0
        let timer = null

        return (...args) => {
            const curTime = +new Date()

            // 第一次执行
            if(curTime - preTime >=wait){
                fn.apply(this, args)
                preTime = curTime
            }else{ // 如果不在间隔时间内，则加一个定时器，在最后一次回调的时候执行
                if(timer) clearTimeout(timer)
                timer = setTimeout(() => {
                    fn.apply(this, args)
                    preTime = curTime
                },wait)
            }
        }         
    }
    const handleSave =useCallback(throttle((e) => {
        setVal(e.target.value)
    },500),[])
       
    return <>
        <Input onChange={handleSave} />
        <span>输入框的值是：{val}</span>
    </>


}
export default ThrottleBox
```
