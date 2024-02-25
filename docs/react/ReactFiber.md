---
title: React-Fiber
author: Jessie
date: "2023-04-12"
---
## React的核心思想

内存中维护一颗虚拟DOM树，数据变化时（setState），自动更新虚拟 DOM，得到一颗新树，然后 Diff 新老虚拟 DOM 树，找到有变化的部分，得到一个 Change(Patch)，将这个 Patch 加入队列，最终批量更新这些 Patch 到 DOM 中。

## React15 VS React16

在react16之前的版本采用的递归的遍历方式，这种也被成为 **Stack Reconciler。**一旦任务开始进行，就**无法中断**，那么 js 将一直占用主线程，一直要等到整棵 Virtual DOM 树计算完成之后，才能把执行权交给渲染引擎，那么这就会导致一些用户交互、动画等任务无法立即得到处理，就会有卡顿，非常的影响用户体。

### **解决方法**

**把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。**

> 合作式调度主要就是用来分配任务的，当有更新任务来的时候，不会马上去做 Diff 操作，而是先把当前的更新送入一个 Update Queue 中，然后交给 **Scheduler** 去处理，Scheduler 会根据当前主线程的使用情况去处理这次 Update。为了实现这种特性，使用了`requestIdelCallback`API。对于不支持这个API 的浏览器，React 会加上 pollyfill。
>
> **`window.requestIdleCallback()`**方法插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间`timeout`，则有可能为了在超时前执行函数而打乱执行顺序
>

## Fiber的定义

> 也称[协程](https://link.juejin.cn/?target=https%3A%2F%2Fwww.liaoxuefeng.com%2Fwiki%2F897692888725344%2F923057403198272)、或者纤程。**🔴React渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。**
它的特性就是**时间分片(time slicing)和暂停(supense)**
>

1. **浏览器没有抢占的条件, 所以React只能用让出机制?**

一是浏览器中没有类似进程的概念，’任务‘之间的界限很模糊，没有上下文，所以不具备中断/恢复的条件。

二是没有抢占的机制，我们无法中断一个正在执行的程序。

它有更一个专业的名词：**[合作式调度(Cooperative Scheduling)](https://juejin.cn/post/6844903874692661255#heading-7)**, 相对应的有**抢占式调度(Preemptive Scheduling)**

1. **怎么确定有高优先任务要处理，即什么时候让出？**

浏览器提供了相关的接口 —— `[requestIdleCallback](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestIdleCallback)` API。**让浏览器在'有空'的时候就执行我们的回调，这个回调会传入一个期限，表示浏览器有多少时间供我们执行, 为了不耽误事，我们最好在这个时间范围内执行完毕。**

```jsx
window.requestIdleCallback(
  callback: (dealine: IdleDeadline) => void,
  option?: {timeout: number}
)
```

```jsx
interface IdleDealine {
  didTimeout: boolean // 表示任务执行是否超过约定时间
  timeRemaining(): DOMHighResTimeStamp // 任务可供执行的剩余时间
}
```

**浏览器在每一帧内都做了什么？【理想的一帧时间是16ms(1000ms / 60)】**

- 处理用户输入事件
- Javascript执行
- requestAnimation 调用
- 布局 Layout
- 绘制 Paint

如果浏览器处理完上述的任务(布局和绘制之后)，还有盈余时间，浏览器就会调用 `requestIdleCallback`的回调。

**但是在浏览器繁忙的时候，可能不会有盈余时间，这时候`requestIdleCallback`回调可能就不会被执行。 为了避免饿死，可以通过requestIdleCallback的第二个参数指定一个超时时间。**

目前 `requestIdleCallback`只有Chrome支持。所以目前 React自己实现了一个。它利用`[MessageChannel](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMessageChannel)`模拟将回调延迟到'绘制操作'之后执行。

**任务优先级**

- `Immediate`(-1) - 这个优先级的任务会同步执行, 或者说要马上执行且不能中断
- `UserBlocking`(250ms) 这些任务一般是用户交互的结果, 需要即时得到反馈
- `Normal` (5s) 应对哪些不需要立即感受到的任务，例如网络请求
- `Low` (10s) 这些任务可以放后，但是最终应该得到执行. 例如分析通知
- `Idle` (没有超时时间) 一些没有必要做的任务 (e.g. 比如隐藏的内容), 可能会被饿死

## Fiber相关的基础概念

### work

在 React Reconciliation 过程中出现的各种必须执行计算的活动，比如 state update，props update 或 refs update 等，这些活动我们可以统一称之为 work。

### **Fiber 对象**

> 每一个 React 元素对应一个 fiber 对象，一个 fiber 对象通常是表征 work 的一个基本单元。fiber 对象有几个属性，这些属性指向其他 fiber 对象。
>

```jsx
Fiber = {
  ...
  // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）
  stateNode: any,
    
    // 单链表树结构
  return: Fiber | null,// 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  child: Fiber | null,// 指向自己的第一个子节点
  sibling: Fiber | null,  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点

  // 更新相关
  pendingProps: any,  // 新的变动带来的新的props
  memoizedProps: any,  // 上一次渲染完成之后的props
  updateQueue: UpdateQueue<any> | null,  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  memoizedState: any, // 上一次渲染的时候的state
    
  // Scheduler 相关
  expirationTime: ExpirationTime,  // 代表任务在未来的哪个时间点应该被完成，不包括他的子树产生的任务
  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,
    
 // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate: Fiber | null,

  // Effect 相关的
  effectTag: SideEffectTag, // 用来记录Side Effect
  nextEffect: Fiber | null, // 单链表用来快速查找下一个side effect
  firstEffect: Fiber | null,  // 子树中第一个side effect
  lastEffect: Fiber | null, // 子树中最后一个side effect
  ....
};
```

创建一个fiber对象

```jsx
export function createFiberFromElement(
    element: ReactElement,
    mode: TypeOfMode,
    expirationTime: ExpirationTime
): Fiber {
    const fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, expirationTime);
    return fiber;
}
```

### **workTag**

> fiber 对象的 tag 属性值，称作 workTag，用于标识一个 React 元素的类型
>

```jsx
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedSuspenseComponent = 18;
export const EventComponent = 19;
export const EventTarget = 20;
export const SuspenseListComponent = 21;
```

### **EffectTag**

> fiber 对象的 effectTag 属性值，每一个 fiber 节点都有一个和它相关联的 effectTag 值。我们把不能在 render 阶段完成的一些 work 称之为副作用，React 罗列了可能存在的各类副作用
>

```jsx
export const NoEffect = /*              */ 0b000000000000;
export const PerformedWork = /*         */ 0b000000000001;

export const Placement = /*             */ 0b000000000010;
export const Update = /*                */ 0b000000000100;
export const PlacementAndUpdate = /*    */ 0b000000000110;
export const Deletion = /*              */ 0b000000001000;
export const ContentReset = /*          */ 0b000000010000;
export const Callback = /*              */ 0b000000100000;
export const DidCapture = /*            */ 0b000001000000;
export const Ref = /*                   */ 0b000010000000;
export const Snapshot = /*              */ 0b000100000000;
export const Passive = /*               */ 0b001000000000;

export const LifecycleEffectMask = /*   */ 0b001110100100;
export const HostEffectMask = /*        */ 0b001111111111;

export const Incomplete = /*            */ 0b010000000000;
export const ShouldCapture = /*         */ 0b100000000000;
```

### **Reconciliation 和 Scheduling**

> 协调（Reconciliation）：根据 diff 算法来比较虚拟 DOM，从而可以确认哪些部分的 React 元素需要更改。
>
> 调度（Scheduling）：确定在什么时候执行 work 的过程。
>

### **Current 树和 WorkInProgress 树**

首次渲染之后，React 会生成一个对应于 UI 渲染的 fiber 树，称之为 current 树。

当 React 遍历 current 树时，它会为每一个存在的 fiber 节点创建了一个替代节点，这些节点构成一个 workInProgress 树。

💡 React 在调用生命周期钩子函数时就是通过判断是否存在 current 来区分何时执行 componentDidMount 和 componentDidUpdate

💡 所有发生 work 的地方都是在 workInProgress 树中执行，如果该树还未创建，则会创建一个 current 树的副本，作为 workInProgress 树。当 workInProgress 树被提交后将会在 commit 阶段的某一子阶段被替换成为 current 树。

**🤔️为什么要增加这两个树🌲？**

避免更新的丢失。比如，如果我们只增加更新到 workInProgress 树，当 workInProgress 树通过从 current 树中克隆而重新开始时，一些更新可能会丢失。同样的，如果我们只增加更新到 current 树，当 workInProgress 树被提交后会被替换为 current 树，更新也会被丢失。通过在两个队列都保持更新，可以确保更新始终是下一个 workInProgress 树的一部分。并且，因为 workInProgress 树被提交成为 current 树，并不会出现相同的更新而被重复应用两次的情况。

### **Effects list**

> 一个存储 effectTag 副作用列表容器。它是由 fiber 节点和指针 nextEffect 构成的单链表结构，这其中还包括第一个节点 firstEffect，和最后一个节点 lastEffect。

💡 React 采用深度优先搜索算法。

</aside>

在 render 阶段遍历 fiber 树时，把每一个有副作用的 fiber 筛选出来，最后构建生成一个只带副作用的 effect list 链表。
在 commit 阶段，React 拿到 effect list 数据后，通过遍历 effect list，并根据每一个 effect 节点的 effectTag 类型，从而对相应的 DOM 树执行更改。

## Render阶段【遍历-收集需要变更的节点】

### 图解

![Untitled](React-Fibe%206c670/Untitled%201.png)

> 此阶段会找出所有节点的变更，如节点新增、删除、属性变更等，这些变更 react 统称为副作用（effect），此阶段会构建一棵`Fiber tree`，以虚拟dom节点为维度对任务进行拆分，即一个虚拟dom节点对应一个任务，最后产出的结果是`effect list`，从中可以知道哪些节点更新、哪些节点增加、哪些节点删除了。
>

### 遍历流程

`React Fiber`首先是将虚拟DOM树转化为`Fiber tree`，因此每个节点都有`child`、`sibling`、`return`属性，遍历`Fiber tree`时采用的是后序遍历方法：

![Untitled](React-Fibe%206c670/Untitled%202.png)

1. 从顶点开始遍历
2. 如果有大儿子，先遍历大儿子；如果没有大儿子，则表示遍历完成
3. 大儿子
    1. 如果有弟弟，则返回弟弟，跳到2
    2. 如果没有弟弟，则返回父节点，并标志完成父节点遍历，跳到2
    3. 如果没有父节点则标志遍历结束

### 收集effect list

> 通过每个节点更新结束时向上归并`effect list`来收集任务结果，最后根节点的`effect list`里就记录了包括了所有需要变更的结果。
>

![Untitled](React-Fibe%206c670/Untitled%203.png)

`firstEffect`: 子树中第一个side effect
`lastEffect`: 子树中最后一个side effect

步骤为：

- 如果当前节点需要更新，则打`tag`更新当前节点状态（props, state, context等）为每个子节点创建fiber。
- 如果没有产生`child fiber`，则结束该节点，把`effect list`归并到`return`，把此节点的`sibling`节点作为下一个遍历节点；否则把`child`节点作为下一个遍历节点
- 如果有剩余时间，则开始下一个节点，否则等下一次主线程空闲再开始下一个节点
- 如果没有下一个节点了，进入`pendingCommit`状态，此时`effect list`收集完毕，结束。

总结：

- 右腿坏了，就把这个右腿打个tag标示，
  - 判断是否有脚，如果有，就打个child fiber
  - 判断是否有脚趾头，遍历脚趾头打fiber
- 如果右腿没有脚，就返回打了tag的右腿，然后换到左腿继续
- 主线程就是大脑，大脑坏了就赶紧治大脑🧠，治好了再回来治腿🦵

## Commit阶段

> 需要将上阶段计算出来的需要处理的副作用一次性执行，此阶段不能暂停，否则会出现UI更新不连续的现象。此阶段需要根据`effect list`
，将所有更新都 commit 到DOM树上。
>

### 根据一个fiber的effect list更新视图

```jsx
const commitWork = currentFiber => {
  if (!currentFiber) return
  let returnFiber = currentFiber.return
  let returnDOM = returnFiber.stateNode // 父节点元素
  if (currentFiber.effectTag === INSERT) {  // 如果当前fiber的effectTag标识位INSERT，则代表其是需要插入的节点
    returnDOM.appendChild(currentFiber.stateNode)
  } else if (currentFiber.effectTag === DELETE) {  // 如果当前fiber的effectTag标识位DELETE，则代表其是需要删除的节点
    returnDOM.removeChild(currentFiber.stateNode)
  } else if (currentFiber.effectTag === UPDATE) {  // 如果当前fiber的effectTag标识位UPDATE，则代表其是需要更新的节点
    if (currentFiber.type === ELEMENT_TEXT) {
      if (currentFiber.alternate.props.text !== currentFiber.props.text) {
        currentFiber.stateNode.textContent = currentFiber.props.text
      }
    }
  }
  currentFiber.effectTag = null
}
```

### **根据全部 fiber 的 effect list 更新视图**

递归函数，从根节点出发，根据`effect list`完成全部更新：

```jsx
const commitRoot = () => {
  let currentFiber = workInProgressRoot.firstEffect
  while (currentFiber) {
    commitWork(currentFiber)
    currentFiber = currentFiber.nextEffect
  }
  currentRoot = workInProgressRoot // 把当前渲染成功的根fiber赋给currentRoot
  workInProgressRoot = null
}
```

### **完成视图更新**

定义循环执行工作，当计算完成每个 fiber 的`effect list`后，调用 commitRoot 完成视图更新

```jsx
const workloop = (deadline) => {
  let shouldYield = false // 是否需要让出控制权
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1 // 如果执行完任务后，剩余时间小于1ms，则需要让出控制权给浏览器
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    console.log('render阶段结束')
    commitRoot() // 没有下一个任务了，根据effect list结果批量更新视图
  }
  // 请求浏览器进行再次调度
  requestIdleCallback(workloop, { timeout: 1000 })
}
```
