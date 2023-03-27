---
title: 二分查找
author: Jessie
date: "2023-02-23"
---

## 核心思想：每次查找区间折半，缩小查找范围

1. Leetcode题：33.34.35.69.74.81.153.154
2. 时间复杂度：O(log n)
3. 注意事项：二分查找算法要求数组是有序的

## 解题思路

1. 确定查找范围:将范围初始化为整个数组，左边界为0，右边界为arr.length-1
2. 二分查找

* 找到查找范围的中间位置
* 如果mid === target，查找成功
* 如果mid > target，则要查找的元素只可能在mid的左边，将右边界缩小为mid-1
* 如果mid < target，则查找的元素只可能在mid的右边，将左边界缩小为mid+1
* 重复以上步骤，直到元素被找到或者查找范围缩小为0

3. 返回结果

## 退出循环

`while(left<=right)`

定义target是在左闭右闭区间

## 取mid ：mid =left+((right - left)>>1)

常见的方式是mid =(left+right)/2，而当left和right很大时，整数溢出就会报错。

在二进制中，位运算符“>>”表示将二进制数向右移动指定的位数。当将一个二进制数向右移动一位时，相当于将该二进制数除以2并向下取整。

* 首先计算出左右边界的差值，即delta =right-left
* 然后将delta 除以2，得到delta/2
* 然后将left和delta/2，就得到中间位置mid

例如：二进制10101右移一位变为1010，相当于将21（10101的十进制表示）除以2，得到10(1010的十进制表示)

假设要在一个长度为 10 的有序数组中查找目标元素 6，初始时的左右边界为 left = 0，right = 9。那么根据上述代码，我们先求出 delta = right - left = 9 - 0 = 9，然后将 delta 右移一位，得到 delta >> 1 = 4，最后将 left 和 delta >> 1 相加，得到 mid = left + (delta >> 1) = 0 + 4 = 4。也就是说，数组中间位置的索引是 4，我们可以通过比较数组中索引为 4 的元素与目标元素的大小关系，来确定下一步查找的范围是左半边还是右半边。

这种方式可以避免在计算中出现整数溢出的问题，因为在某些情况下，当left和right非常大时，left+right可能会超出整型数据类型所能表示的范围。通过使用delta = right - left的方式，我们可以将左右边界的差值表示为一个非负整数，从而避免了这个问题的出现

## 例题

### 34.在排序数组中查找元素的第一个和最后一个位置

#### 🔸题目

给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。如果数组中不存在目标值 target，返回 [-1, -1]。你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

示例 1：

```js
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
```

#### 🔸思路

当我们看到数组有序，首先想到二分查找。通过二分查找算法找到目标元素的一个出现位置，然后分别向左和向右遍历数组，直到找到目标元素的第一个和最后一个位置。

具体步骤如下：

1. 首先找到目标值第一次出现的位置。对于升序排列的数组，如果目标值存在，则它必然出现在某个连续的区间内。因此我们可以不断缩小区间范围，直到找到目标值的第一个位置

```js
a. 初始化左边界left为0，右边界right为数组长度减1

b. 当left <= right时，执行以下步骤：
  i. 计算中间位置mid = left+((right - left)>>1)

  ii. 如果nums[mid]等于target，则说明目标值在mid的左侧或就是mid本身，将right = mid - 1

  iii. 如果nums[mid]小于target，则目标值在mid的右侧，将left = mid + 1

  iv. 如果nums[mid]大于target，则目标值在mid的左侧，将right = mid - 1

c. 当left > right时，返回left
```

2. 然后找到目标值最后一次出现的位置。与第一次查找不同，这次我们要找到目标值最后一次出现的位置，因此我们需要不断缩小区间范围，直到找到目标值的最后一个位置

```js
a. 初始化左边界left为第一次查找到的位置，右边界right为数组长度减1。

b. 当left <= right时，执行以下步骤：
  i. 计算中间位置mid = left+((right - left)>>1)

  ii. 如果nums[mid]等于target，则说明目标值在mid的右侧或就是mid本身，将left = mid + 1。

  iii. 如果nums[mid]小于target，则目标值在mid的右侧，将left = mid + 1。

  iv. 如果nums[mid]大于target，则目标值在mid的左侧，将right = mid - 1。

c. 当left > right时，返回right
```

3. 最后将第一次查找到的位置和最后一次查找到的位置合并起来，得到目标值的起始位置和结束位置。如果第一次查找到的位置大于最后一次查找到的位置，则说明目标值不存在，返回[-1, -1]

#### 🔸具体实现

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let result=[-1,-1]
  while (left <= right) {
    let mid = left + ((right - left) >> 1);
    if (nums[mid] === target) {
      let min = mid;
      let max = mid;
      while (min >= 0 && nums[min] === target) {
        min--;
      }
      while (max < nums.length && nums[max] === target) {
        max++;
      }
      result[0] = min+1
      result[1] = max-1
      break
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return result;
};
```

### 81. 搜索旋转排序数组 II

#### 🔸题目

已知存在一个按非降序排列的整数数组 nums ，数组中的值不必互不相同。

在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转 ，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,4,4,5,6,6,7] 在下标 5 处经旋转后可能变为 [4,5,6,6,7,0,1,2,4,4] 。

给你 旋转后 的数组 nums 和一个整数 target ，请你编写一个函数来判断给定的目标值是否存在于数组中。如果 nums 中存在这个目标值 target ，则返回 true ，否则返回 false 。

你必须尽可能减少整个操作步骤。

示例 1：

```js
输入：nums = [2,5,6,0,0,1,2], target = 0
输出：true
```

#### 🔸解题思路

▫️普通的二分查找中，我们每次将查找区间缩小一半，直到找到目标元素或者查找区间为空。

▫️在旋转排序数组中，我们可以先将查找区间的中间位置mid计算出来，然后判断mid所在的位置是在数组的左半部分还是右半部分。

#### 🔸判断逻辑

1. 如果mid所在的位置在数组的左半部分，那么我们可以判断数组左半部分是否是有序的。

如果左半部分是有序的，并且目标元素在左半部分中，那么我们可以将查找区间缩小到左半部分，并继续进行二分查找。

否则，我们需要将查找区间缩小到右半部分，并继续进行二分查找。

2. 如果mid所在的位置在数组的右半部分，那么我们可以判断数组右半部分是否是有序的。

如果右半部分是有序的，并且目标元素在右半部分中，那么我们可以将查找区间缩小到右半部分，并继续进行二分查找。

否则，我们需要将查找区间缩小到左半部分，并继续进行二分查找。

3. 如果我们在二分查找过程中，出现了查找区间的左、中、右三个位置所对应的元素都相等的情况，那么无法判断目标元素所在的位置。这时，我们可以将左指针往右移动一位，将右指针往左移动一位，以缩小查找区间。

#### 🔸具体实现

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {boolean}
 */
var search = function (nums, target) {
  let right = nums.length - 1;
  let left = 0;
  while (left <= right) {
    let mid = left + ((right-left) >>1)
    if(nums[mid] === target) return true
    if(nums[mid] === nums[left] && nums[mid] === nums[right]) {
       right --
       left++
    }else if(nums[mid] >= nums[left]) {
        if(target>=nums[left] && target <nums[mid]){
            right=mid-1
        }else{
            left=mid+1
        }
    }else{
        if(target<=nums[right] && target>nums[mid]){
            left=mid+1
        }else{
            right=mid-1
        }
    }
  }
  return false

};
```
