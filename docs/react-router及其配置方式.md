## react-router及其配置方式

### 介绍路由的history


路由器Router就是React的一个组件，Router组件本身只是一个容器，真正的路由要通过Route组件定义。如下：

```

import { Router, Route, hashHistory } from 'react-router';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/repos" component={Repos}/>
  	 <Route path="/about" component={About}/>
  </Router>
), document.getElementById('app'));

```
在这里path与component一一对应，例如：访问/about（http://localhost:8080/#/about）时，加载About组件。

Route还可以嵌套使用，如下：

```

import { Router, Route, hashHistory } from 'react-router';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
    	<Route path="/repos" component={Repos}/>
  	 	<Route path="/about" component={About}/>
  	 </Route>
  </Router>
), document.getElementById('app'));

//readt-router 2.x

```
上面代码中，用户访问/repos时，会先加载App组件，然后在它的内部再加载Repos组件。其中App组件要以这样的形式写：

```
export default React.createClass({
  render() {
    return <div>
      {this.props.children}
    </div>
  }
})
```
这里this.props.children就是App的子组件

但是在4.0以后，嵌套的路由与之前的就完全不同了，需要单独放置在嵌套的根component中去处理路由。如下：

```
<Route component={App}>
    <Route path="groups" components={Groups} />
    <Route path="users" components={Users}>
      //<Route path="users/:userId" component={Profile} />
    </Route>
</Route>
```
```

const Users = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <Route path={`${match.url}/:userId`} component={Profile}/>
  </div>
) 

```
#### path

path属性指定路由的匹配规则,可以使用通配符。如下：

```

<Route path="/hello/:name">
// 匹配 /hello/michael
// 匹配 /hello/ryan

<Route path="/hello(/:name)">
// 匹配 /hello
// 匹配 /hello/michael
// 匹配 /hello/ryan

<Route path="/files/*.*">
// 匹配 /files/hello.jpg
// 匹配 /files/hello.html

<Route path="/files/*">
// 匹配 /files/ 
// 匹配 /files/a
// 匹配 /files/a/b

<Route path="/**/*.jpg">
// 匹配 /files/hello.jpg
// 匹配 /files/path/to/file.jpg
```
匹配规则如下：

```
（1）:paramName

:paramName匹配URL的一个部分，直到遇到下一个/、?、#为止。这个路径参数可以通过this.props.params.paramName取出。

（2）()

()表示URL的这个部分是可选的。

（3）*

*匹配任意字符，直到模式里面的下一个字符为止。匹配方式是非贪婪模式。

（4） **

** 匹配任意字符，直到下一个/、?、#为止。匹配方式是贪婪模式。
```


#### react-router配置方式
* 1. 标签的方式

```
import { IndexRoute } from 'react-router'

const Dashboard = React.createClass({
  render() {
    return <div>Welcome to the app!</div>
  }
})

React.render((
  <Router>
    <Route path="/" component={App}>
      {/* 当 url 为/时渲染 Dashboard */}
      <IndexRoute component={Dashboard} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>
), document.body)
```
这种路由配置方式使用Route标签，然后根据component找到对应的映射。

* 2. 对象配置方式

```
const routeConfig = [
  { path: '/',
    component: App,
    indexRoute: { component: Dashboard },
    childRoutes: [
      { path: 'about', component: About },
      { path: 'inbox',
        component: Inbox,
        childRoutes: [
          { path: '/messages/:id', component: Message },
          { path: 'messages/:id',
            onEnter: function (nextState, replaceState) {
              //do something
            }
          }
        ]
      }
    ]
  }
]

React.render(<Router routes={routeConfig} />, document.body)

```
这种路由配置方式是创建一个路由对象，传入Router容器中，路由对象一级一级都有path跟component一一对应。

* 3. 按需加载配置方式

### 


