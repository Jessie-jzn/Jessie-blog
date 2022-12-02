---
title: 数组去重
author: Jessie
date: "2022-06-12"
---

在前端开发中，总会需要对数据进行处理，而数组去重则是最常遇到的场景，本文总结了几种思路，包括原地改动数组及使用额外空间的情况。

## 不使用额外空间

所谓的不使用额外的空间，就是就原地修改该数组

### 转为对象

将数组转为对象，对象的key都为唯一值，则会把重复的去掉

```js
var removeDuplicates = function(nums) {
    let obj = {}
    for(let i =0; i<nums.length;i++){
       let item = nums[i]
       if(obj[item] !== undefined){
           nums.splice(i,1)
           i--
           continue
       }
       obj[item]=item
    }
    return nums
}
```

### 指针法

```JavaScript
var removeDuplicates = function(nums) {
    let index =0;
    for(let i=0;i<nums.length;i++){
        if(nums[i] !==nums[index]){
            nums[++index]=nums[i]
        }
    }
    return nums.splice(index+1,nums.length-index+1)
}
```

### 双指针法

需要数组为**升序排列**状态，如果不是的话进行排序下，就需要用额外的空间

```JavaScript
var removeDuplicates = function(nums) {
    let slow =0
    for(let fast=1;fast<=nums.length;fast++){
        if(nums[slow] < nums[fast]){
            nums[++slow]=nums[fast]
        }
     }
     return nums
}
```

## 使用额外空间

### 新建数组比较再push

```JavaScript
//先排序再判断前后是否有相同的值，须注意溢出问题
var removeDuplicates = function(nums) {
    const s = nums.sort()
    let result = [s[0]]
    for (let i = 1; i <= s.length; i++) {
        if(s[i] > s[i - 1]){
            result.push(s[i])
        }
    }
    return result
}
```

### 借助includes

```JavaScript
var removeDuplicates = function(nums) {
    let result = []
    for(let i = 0;i<nums.length;i++){
        if(!result.includes(nums[i])){
            result.push(nums[i])
        }
    }
    return result
}
```

### 借助Set

```js
var removeDuplicates = function(nums) {
    return [...new Set(nums)]
}
```
