### React生命周期及自己的理解
#### React生命周期
React 组件的生命周期根据广义定义描述，可以分为挂载、渲染和卸载这几个阶段。当渲染 后的组件需要更新时，我们会重新去渲染组件，直至卸载。

##### 组件生命周期涉及到的十个方法如下：

![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午10.42.39.png)

1.getDefaultProps
作用于组件类，**只调用一次**，返回对象用于设置默认的props。

2.getInitialState
作用于组件的实例，在实例创建时**调用一次**，用于初始化每个实例的state，此时可以访问this.props。

3.componentWillMount
在完成首次渲染之前调用，此时仍可以修改组件的state。**调用一次（前提是不用SSR）**

4.render
必选的方法，创建虚拟DOM，该方法具有特殊的规则：

* 只能通过this.props和this.state访问数据
* 可以返回null、false或任何React组件
* 只能出现一个顶级组件（不能返回数组）
* 不能改变组件的状态

5.componentDidMount
真实的DOM被渲染出来后调用，在该方法中可通过this.getDOMNode()访问到真实的DOM元素。此时已可以使用其他类库来操作这个DOM。**调用一次**

在服务端中，该方法不会被调用。

6.componentWillReceiveProps
组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。

7.shouldComponentUpdate
组件是否应当渲染新的props或state，返回false表示跳过后续的生命周期方法，通常不需要使用以避免出现bug。在出现应用的瓶颈时，可通过该方法进行适当的优化。
在首次渲染期间或者调用了forceUpdate方法后，该方法不会被调用

8.componentWillUpdate
接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state。

9.componentDidUpdate
完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。

10.componentWillUnmount
组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器。

##### 组件的生命周期执行顺序是什么样子的？

![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午10.40.51.png)

具体情况分析：

如果是一个个组件嵌套的，执行情况如何呢？，如下图嵌套关系：
![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午10.58.05.png)

如果不涉及到setState更新，第一次渲染的顺序如下：
![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午11.39.09.png)

如果App触发setState:
![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午11.57.31.png)

如果Parent触发setState:
![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午11.57.47.png)

如果child触发setState:
![](/Users/wujian/Desktop/屏幕快照 2019-04-14 上午11.57.56.png)

总的来说，完成前的顺序是从根部到子部，完成时时从子部到根部。




#### 细节

#### React中数据获取为什么一定要在componentDidMount里面调用？
在组件初始化过程中，一次执行了constroctor,componentWillMount,render,componentDidMount。

* 如果放入constroctor：

constructor()中获取数据的话，如果时间太长，或者出错，组件就渲染不出来，整个页面都没法渲染了。

constructor是作组件state初绐化工作，并不是设计来作加载数据的。


* 如果放入componentWillMount:


获取到数据肯定需要setState去更新组件状态，但在这个里头执行setState,
组件会更新 state， 但组件只渲染一次。因此，这是无意义的执行。

* 如果放入render:


无限render

* 如果放入componentDidMount:


确保已经render过一次。提醒我们正确地设置初始状态，这样就不会得到导致错误的"undefined"状态。

componentDidMount方法中的代码，是在组件已经完全挂载到网页上才会调用被执行，所以可以保证数据的加载。此外，在这方法中调用setState方法，会触发重渲染。所以，官方设计这个方法就是用来加载外部数据用的，或处理其他的副作用代码。


**更新： shouldComponentUpdate**

booleanshouldComponentUpdate(object nextProps, object nextState)

在接收到新的props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。

如果确定新的props 和 state 不会导致组件更新，则此处应该 返回 false。

shouldComponentUpdate:function(nextProps,nextState) {
  return nextProps.id!== this.props.id;
}

如果 shouldComponentUpdate 返回false，则 render() 将不会执行，直到下一次 state 改变。（另外，componentWillUpdate 和 componentDidUpdate 也不会被调用。）

默认情况下，shouldComponentUpdate 总会返回true，在 state 改变的时候避免细微的bug，但是如果总是小心地把 state 当做不可变的，在 render() 中只从 props 和state 读取值，此时你可以覆盖 shouldComponentUpdate 方法，实现新老 props 和state 的比对逻辑。

如果性能是个瓶颈，尤其是有几十个甚至上百个组件的时候，使用 shouldComponentUpdate可以提升应用的性能。

**更新： componentWillReceiveProps**

componentWillReceiveProps(object nextProps)

在组件接收到新的props 的时候调用。在初始化渲染的时候，该方法不会调用。

用此函数可以作为react 在 prop 传入之后， render() 渲染之前更新 state 的机会。老的 props 可以通过 this.props 获取到。在该函数中调用 this.setState() 将不会引起第二次渲染。

componentWillReceiveProps:function(nextProps){
  this.setState({
    likesIncreasing: nextProps.likeCount> this.props.likeCount
  });
}

注意：

对于state，没有相似的方法： componentWillReceiveState。将要传进来的 prop 可能会引起 state 改变，反之则不然。如果需要在state 改变的时候执行一些操作，请使用 componentWillUpdate。

**更新：不能在shouldComponentUpdate 或 componentWillUpdate 方 法 中 调 用 setState **

如 果 在 shouldComponentUpdate 或 componentWillUpdate 方 法 中 调 用 setState ， 此 时 this._pendingStateQueue != null，则 performUpdateIfNecessary 方法就会调用 updateComponent 方法进行组件更新，但 updateComponent 方法又会调用 shouldComponentUpdate 和 componentWill- Update 方法，因此造成循环调用，使得浏览器内存占满后崩溃