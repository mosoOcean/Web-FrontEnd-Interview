###redux

#### redux概念及API解析


##### createStore
 Redux 提供createStore这个函数，用来生成 Store。
 
 ```
 import { createStore } from 'redux';
const store = createStore(fn);
 ```
 这里createStore传入一个函数作为参数，为什么呢。

实际应用中，Reducer 函数不用手动调用，**store.dispatch**方法会触发 Reducer 的自动执行。为此，Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入createStore方法，所以这个fn为reducer。这样，以后每当store.dispatch发送过来一个新的 Action，就会自动调用 Reducer，得到新的 State。

当前时刻的 State，可以通过**store.getState()**拿到,State与view一一对应。

createStore还可以接受第二个参数，即初始的state。如果传入，则reducers中的state默认值会被覆盖。

##### combineReducers
Redux 提供combineReducers这个函数，用来生成合并多个子reducer,作为最后的Reducer传入createStore去生成store。这样就能对reducer进行拆分，这样做的好处是可以为每个组件独立出来维护，清晰明了。
 
##### Reducer

 Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出.
 由于 Reducer 是纯函数，就可以保证同样的State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。
 
 ```
 // State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}
// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
 ```
##### store的三个方法
* store.getState()
* store.dispatch()
* store.subscribe()

#### redux工作流
* 首先用户触发动作，发出action

 ```
 store.dispatch(action)
 ```

* store会自动调起reducer,传入当前的state及action，返回新的state


 ```
 let nextState = todoApp(previousState, action);
 ```

* 一旦state发生变化，store就回调用监听函数。listener可以通过store.getState()得到当前状态。如果使用的是 React，这时可以触发重新渲染 View

 ```
 function listerner() {
  let newState = store.getState();
  component.setState(newState);   
}
store.subscribe(listener);
 ```
 #### react-redux
 
 https://blog.csdn.net/DFF1993/article/details/80410154
 
 #### redux中间件
 
 中间件它提供了一个分类处理 action 的机会。在 middleware 中，你可以检阅每一个流过的 action，挑选出特定类型的 action 进行相应操作，给你 一次改变 action 的机会。它就是一个函数，对store.dispatch方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。
 
 ```
 let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
 ```
 
#### 相关问题
##### Redux如何实现多个组件之间的通信，多个组件使用相同状态如何进行管理？
Redux 通过传入reducer参数至createStore方法生成一个数据容器store，这个store有以下功能：

• 提供getState()方法获取state；
 
• 提供dispatch(action)方法触发Reducer的自动执行，更新state； 

• 通过subscribe(listener)注册监听器，监听state变化，state一旦发生改变就会触发store的更新，然后把状态丢给想要这个状态的组件，最终view会根据store数据的更新刷新界面; 

• 通过subscribe(listener)返回的函数注销监听器

似发布订阅模式, 一个地方修改了这个值, 其他所有使用了这个相同状态的地方也会更改。

##### 多个组件之间如何拆分各自的state，每块小的组件有自己的状态，它们之间还有一些公共的状态需要维护，如何思考这块?

##### redux中间件的认识？
* 为什么要用到中间件？
https://blog.csdn.net/zk65645/article/details/62215500
https://segmentfault.com/a/1190000016668365
https://blog.csdn.net/xiangzhihong8/article/details/81295266
https://segmentfault.com/a/1190000010757370
https://segmentfault.com/a/1190000015773713
http://www.mamicode.com/info-detail-2141523.html


* redux如何提供插拔式中间件功能的能力支持（中间件原理）？


* 如何实现一个中间件？




 
 
