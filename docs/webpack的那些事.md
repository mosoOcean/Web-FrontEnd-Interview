####webpack是什么？
webpack把自己定位为module building system（在webpack看来，所以的文件都是模块），所以我们可以看做是模块打包机：它做的事情是，分析你的项目结构，找到模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。

####为什么要使用webpack?
现在的前端项目越来越复杂，为了简化前端项目的开发，我们会细化前端工程，比如工程模块化，并且会使用ES6/ES7或者JSX等现代浏览器不能识别的语法，以及Scss，less等CSS预处理器等，利用它们开发大大提高了我们的开发效率，但这些文件往往需要进行额外的处理才能让浏览器识别，这样我们就需要一款像gulp/webpack这样的工具去管理前端项目。
虽然gulp的插件也可以去解决上述的问题，但是它更像是一个能够优化前端开发流程的工具，而webpack则是一种模块化的解决方案，把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。并且Webpack的处理速度更快更直接，能打包更多不同类型的文件。而且生态做的很好。 

##### 优点：
Plugins(插件)
webpack有着丰富的插件接口,这使得webpack非常的灵活

Performance(性能)
webpack使用异步I/O和多级缓存,这使得webpack在增量编译上极其快.

Loader(装载机)
webpack支持通过装载机预处理文件.这允许你处理任何静态资源(不仅仅是JavaScript),你可以很轻松的写出在Nodejs上运行的装载机.

Suport(支持)
webpack支持AMD和CommonJs模块样式.它巧妙的在你代码的AST中进行静态分析,它甚至还能处理简单的表达式,这样就允许你支持更多的类库.

Code Splitting(代码拆分)


**webpack允许你将你的代码拆分成块,每块代码按需加载,这样就可以减少初始化加载时间**.

Optimizations(优化)
webpack可以大量的优化来减少输出的大小,并使用hashes来实现请求缓存.

Development Tools(开发工具)


**webpack支持SourceUrls和SourceMaps进行简单的调试**.通过development middleware来监控文件和development server来自动刷新.

Multiple targets(多个目标)
webpack的主要目标是web,同时它也支持为nodejs和WebWorkers上的代码打包.

#### 插件

##### webpack-dev-middleware
它是一个express式的开发中间件，生成一个与webpack的compiler绑定的中间件，然后在express启动的服务app中调用这个中间件，只用在开发态。


* 它有以下几点优点：


1. 不用将文件写入磁盘，直接把需要处理的文件放入内存中，快速编译；


2. 如果在监控模式下文件改变了，这个中间件会自动打包（走内存），并且会在打包完后才会处理浏览器的请求；（这也是为什么不用webpack的watch mode）


3. 支持热更新；

因为它是express式的中间件，因此只用于能接受express搭建的服务,它一般与接下来要介绍的webpack-hot-middleware一起使用。


应用示例：

```
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const compiler = webpack({ .. webpack options .. });
const express = require('express');
const app = express();
 
app.use(middleware(compiler, {
  // webpack-dev-middleware options
}));
 
app.listen(3000, () => console.log('Example app listening on port 3000!'))
```
具体参数（只有publicPath是必须的）:

```
noInfo: false,
//  显示无信息到控制台（仅警告和错误） 

quiet: false,
//  向控制台显示任何内容 

lazy: true,
//  切换到延迟模式 
//  这意味着没有观看，而是重新编译每个请求  

watchOptions: {
aggregateTimeout: 300,
poll: true
},
// watch options (only lazy: false) 

publicPath: "/assets/",
//  绑定中间件的公共路径 
//  使用与webpack相同 
//  必须的

index: "index.html",
//  Web服务器的索引路径，默认为“index.html”。 
//  如果falsy（但不是未定义），服务器将不会响应到根URL的请求。 

headers: { "X-Custom-Header": "yes" },
//  自定义标题  

mimeTypes: { "text/html": [ "phtml" ] },
//  添加自定义mime /扩展映射 
// https://github.com/broofa/node-mime#mimedefine  
// https://github.com/webpack/webpack-dev-middleware/pull/150  

stats: {
  colors: true
},
//  用于形成统计信息的选项 

reporter: null,
//  提供自定义记录器来更改日志显示的方式。 

serverSideRender: false,
//  关闭服务器端渲染模式。有关详细信息，请参阅服务器端渲染部分。
```

##### webpack-hot-middleware
它是用来进行页面的热重载的,刷新浏览器。 一般和 webpack-dev-middleware 配合使用，实现热加载功能。

怎么工作的呢？
每个连接的客户端会得到一个 Server Sent Events的连接，服务器会向客户端发布来自打包机事件的信息。客户端接收到信息后会比较本地代码是不是最新的，如果不是，会出发webpack的热重载。

应用示例：

```
//先增加webpack-dev-middleware
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var compiler = webpack(webpackConfig);
 
app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
}));
//然后增加webpack-hot-middleware ,注意用的是同一个compiler实例
app.use(require("webpack-hot-middleware")(compiler));
```
它配置项可以通过query 方式添加到webpack config中的路径来传递给客户端，例如：

```
'webpack-hot-middleware/client?path=/__what&timeout=2000&overlay=false'
```
参数如下：

```
path - 中间件为事件流提供的路径
name - 捆绑名称，专门用于多编译器模式
timeout - 尝试重新连接后断开连接后等待的时间
overlay - 设置为false禁用基于DOM的客户端覆盖。
reload - 设置为true在Webpack卡住时自动重新加载页面。
noInfo - 设置为true禁用信息控制台日志记录。
quiet - 设置为true禁用所有控制台日志记录。
dynamicPublicPath - 设置为true使用webpack publicPath作为前缀path。（我们可以__webpack_public_path__在入口点的运行时动态设置，参见output.- publicPath的注释）
autoConnect - 设置为false用于防止从客户端自动打开连接到Webpack后端 - 如果需要使用该setOptionsAndConnect功能修改选项
```
通过传递第二个参数，可以将配置选项传递给中间件。

```
webpackHotMiddleware(webpack,{
    log: false,
    path: "/__what",
    heartbeat: 2000
})
```
参数：

```
log - 用于记录行的函数，传递false到禁用。默认为console.log
path - 中间件将服务事件流的路径必须与客户端设置相匹配
heartbeat - 多长时间将心跳更新发送到客户端以保持连接的活动。应小于客户的timeout设置 - 通常设置为其一半值。
```
对于多个compiler的情况。又如下的栗子：

```
// webpack.config.js
module.exports = [
    {
        name: 'mobile',
        entry: {
            vendor: 'vendor.js',
            main: ['webpack-hot-middleware/client?name=mobile', 'mobile.js']
        }
    },
    {
        name: 'desktop',
        entry: {
            vendor: 'vendor.js',
            main: ['webpack-hot-middleware/client?name=desktop', 'desktop.js']
        }
    }
]
```
这样就可以分别热重载互补干扰。

##### html-webpack-plugin
它有以下作用：

1. 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题

2. 可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口


