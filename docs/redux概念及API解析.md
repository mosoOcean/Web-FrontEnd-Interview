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
 
 #### redux中间件
 中间件就是一个函数，对store.dispatch方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能。
 
 ```
 let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
 ```
 
