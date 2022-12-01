---
title: 函数防抖
author: Jessie
date: "2022-11-30"
---


## 概念

> 事件被触发 n 秒之后再执行回调，如果在这 n 秒内事件又被触发，则重新计时
>
> 通过function闭包原理，缓存了`timer`变量，然后通过`clearTimeout`清除冗余操作

### 使用场景

1. 按钮提交：防⽌多次提交按钮，只执⾏最后提交的⼀次
2. 服务端验证：表单验证需要服务端配合，只执⾏⼀段连续的输⼊事件的最后⼀次，搜索联想词功能等

### 基础代码

```javascript

const DebounceBox = () => {
    const [val,setVal]=useState('')

    const debounce = (fn,wait) => {
        console.log('执行')
        let timer =null
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn()
        }, wait);

    }
    const handleSave =(e) =>debounce(() => {
        setVal(e.target.value)
    },1000)


       
    return <>
        <Input onChange={handleSave} />
        <span>输入框的值是：{val}</span>

    </>
}
export default DebounceBox
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
