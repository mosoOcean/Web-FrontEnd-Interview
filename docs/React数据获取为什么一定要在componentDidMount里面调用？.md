### React数据获取为什么一定要在componentDidMount里面调用？

这与React组件的生命周期有关，组件挂载时有关的生命周期有以下几个:

> constructor()
> 
> componentWillMount()
> 
> render()
> 
> componentDidMount()

上面这些方法的调用是有次序的，由上而下，也就是当说如果你要获取外部数据并加载到组件上，只能在组件"已经"挂载到真实的网页上才能作这事情，其它情况你是加载不到组件的。

componentDidMount方法中的代码，是在组件已经完全挂载到网页上才会调用被执行，所以可以保证数据的加载。此外，在这方法中调用setState方法，会触发重渲染。所以，官方设计这个方法就是用来加载外部数据用的，或处理其他的副作用代码。

constructor被调用是在组件准备要挂载的最一开始，所以此时组件尚未挂载到网页上。

componentWillMount方法的调用在constructor之后，在render之前，在这方法里的代码调用setState方法不会触发重渲染，所以它一般不会用来作加载数据之用，它也很少被使用到。

一般的从后台(服务器)获取的数据，都会与组件上要用的数据加载有关，所以都在componentDidMount方法里面作。虽然与组件上的数据无关的加载，也可以在constructor里作，但constructor是作组件state初绐化工作，并不是设计来作加载数据这工作的，所以所有有副作用的代码都会集中在componentDidMount方法里。

补充一下，Redux作初始数据载入时，是可以不需透过React组件的生命周期方法，大致的方式如下代码:

```
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'

// reducer
function items(state = [], action) {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return [...action.payload]
    default:
      return state
  }
}

// 创建store
const store = createStore(items)

fetch('http://localhost:8888/items', {
  method: 'GET'
})
.then((response) => {
  // ok代表状态码在200-299
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
})
.then((itemList) => {
  // 作dispatch动作，载入外部数据完成之后
  store.dispatch({ type: 'LOAD_ITEMS', payload: itemList })
})
.catch((error) => { throw new Error(error.message) })

// React组件加载到真实DOM上
ReactDOM.render(
<Provider store={store}>
 <App />
</Provider>, document.getElementById('root'))
```

为何可以这样作的原因，是Redux的store中的状态有一个最初始的值(reducer上传参里的默认值)，组件先初始化完成，接著异步的fetch用promise语法，在作完外部数据加载后，发送动作出来，此时reducer更动store里的状态，react-redux绑定器会触发React组件的重渲染，所以组件上数据会自动更新。

有问题再问吧，代码写得简略但测试过是可执行的。