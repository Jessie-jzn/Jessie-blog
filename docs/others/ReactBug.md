---
title: React常见错误解决
author: Jessie
date: "2019-06-18"
---
最近在做react项目的时候遇到了几个报错，这几个报错在react项目还算常见，因此记录下来解决方法。

----------

**'type' is missing in props validation**
**报错**：type缺少props验证
**解决：**
1.查看下propTypes是否写成大写了，因为我们引入的时候是大写的，所以很多小伙伴可能直接复制过来就成大写了，也会报错哦
2.新增`type: PropTypes.number`

```js
import PropTypes from 'prop-types';
const ReportOperate = ({ logId, type }) => {
  return <>
    <a href='javascript:;' onClick={() => handleJump(record.logId, record.type)} style={{ color: '#1DA57A' }}>查看详情</a>
    <a href={record.filePath} style={{ marginLeft: 20, color: '#1DA57A' }}>下载日志</a>
  </>
}
ReportOperate.propTypes = {
  logId: PropTypes.number,
  type: PropTypes.number,//加上这句就好了
}
export default ReportOperate
```

----------
**throw new Error('Cyclic dependency' + nodeRep)
Error:Cyclic dependency**
**报错：** Webpack 循环依赖
**解决：**

```js
npm i --save-dev html-webpack-plugin@next
```

----------
**Cannot destructure property `getFieldDecorator` of 'undefined' or 'null'.**
**报错：** 无法破坏getFieldDecorator属性undefine或null
**解决：**
1.是否没有注入Form.create()

```js
// 无状态组件
export default Form.create()(SearchForm)

//有状态组件
@Form.create()
```

----------
**Uncaught Error: Invariant Violation: Objects are not valid as a React child (found: object with keys {child}). If you meant to render a collection of children, use an array instead or wrap the object using createFragment(object) from the React add-ons. Check the render method of Matchs.**
**报错原因：** 对数组进行map，然后取成了对象
**解决：**
1.map里面某一项取值是对象

----------
**Uncaught TypeError: Cannot read property 'isSelectOptGroup' of undefined**
**报错原因：** `const Option = Select.option` 引入ant design 的select错误
**解决：**
改成下面的

```js
const { Option } = Select
```

----------
**VM38184:1 Uncaught (in promise) Error: Actions must be plain objects. Use custom middleware for async actions.**
**报错原因：** 缺少了dispatch
**解决：**
改成下面的

```js
// 错误示范：
remove: params  => {
    const { contentId } = params

    return post('/content/topic/deleteBxTopic', { id: contentId }).then(result => {
      if (result) {
        Message.success('删除成功')
      }
    })
  },

// 正确示范：
remove: params => dispatch => {
    const { contentId } = params

    return post('/content/topic/deleteBxTopic', { id: contentId }).then(result => {
      if (result) {
        Message.success('删除成功')
      }
    })
  },
```

----------
**backend.js:6 ./src/pages/beach/containers/Reward.js
Module not found: Error: Can't resolve 'antd/es/descriptions' in '/Users/chenjiaxin/bull/src/pages/beach/containers'**
或者
**Module not found: Can't resolve 'antd/es/affix'**
**报错原因：**
在项目中使用了antd里面的Descriptions描述列表组件，发现报了这个错误，根本原因就是使用的antd版本里面没有这个组件，项目中引用的antd版本是3.16.0，而我看的文档版本已经到了3.24.0了
**解决：** 将antd 版本更新到最新或者文档里的版本

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191102153652639.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3puNzQwMzk1ODU4,size_16,color_FFFFFF,t_70)
----------

**Uncaught TypeError: Cannot convert undefined or null to object**
**报错原因：** 由于undefined和null无法转成对象，如果用Object.keys等操作的话需要加个对象作为初始值。
**解决：**

```javascript
 const [firstResponsibility, setFirstResponsibility] = useState({})
```

----------
**Uncaught TypeError: Cannot read property 'value' of null**

**报错原因：** 涉及到React中的合成事件，debounce包装后的回调函数，是个异步事件，即e.target为null了

> The SyntheticEvent is pooled. This means that the SyntheticEvent object will be reused and all properties will be nullified after the event callback has been invoked. This is for performance reasons. As such, you cannot access the event in an asynchronous way.

**解决：**

```javascript

//错误代码
<Search
 addonBefore={prefixSelector}
    style={{ width: 250 }}
    allowClear
    onChange={debounce(e => {
     console.log('e', e)
     e.persist()
     setSearchValue((e.target || {}).value)
     handleChangeParams(searchId, (e.target || {}).value)
   }, 1000)}
/>
 // 错误代码，可以执行，但是还是执行多次，没有起到防抖的效果
<Search
   addonBefore={prefixSelector}
   style={{ width: 250 }}
   allowClear
   onChange={e => {
     e.persist()
     debounce(() => {
       setSearchValue((e.target || {}).value)
       handleChangeParams(searchId, (e.target || {}).value)
     }, 2000)()
   }}
/>

// 正确代码
<Search
    addonBefore={prefixSelector}
    style={{ width: 250 }}
    allowClear
    onChange={e => {
       e.persist()
       handleChangeValue(e)
     }}
/>
const handleChangeValue = debounce(e => {
    setSearchValue((e.target || {}).value)
    handleChangeParams(searchId, (e.target || {}).value)
  }, 1000)
```

vendor.js:1 Uncaught Error: Minified React error #306; visit https://reactjs.org/docs/error-decoder.html?invariant=306&args[]=()&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.

----------
**Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.**
**报错原因：** 标签内的onClick事件立刻执行导致死循环，加载过多
**解决：**

```javascript
// 错误代码
<CommonTabBox onCallBack={setCurTab} />
// 正确代码
 <CommonTabBox onCallBack={val => setCurTab(val)} />
```

----------
**无法使用 JSX，除非提供了 "--jsx" 标志**
**解决：**
在vscode的setting.json中设置

```js
 "typescript.tsdk": "node_modules\\typescript\\lib",
```

----------
**无法找到模块“react/jsx-runtime”的声明文件。**
**解决：**
npm install -D @types/库的名字
