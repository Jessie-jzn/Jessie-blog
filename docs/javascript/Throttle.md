---
title: 函数节流
author: Jessie
date: "2022-11-30"
---

## 概念

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
