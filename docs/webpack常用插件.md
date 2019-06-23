### webpack-dev-middleware
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

### webpack-hot-middleware
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

### html-webpack-plugin
它有以下作用：

1. 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题

2. 可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口
