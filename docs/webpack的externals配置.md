#### 为什么要配置externals
- 官网解释：

> webpack 中的 externals 配置提供了**不从 bundle 中引用依赖**的方式。解决的是，所创建的 bundle 依赖于那些存在于用户环境(consumer environment)中的依赖。

怎么理解呢，意思是如果需要引用一个库，但是又不想让webpack打包（减少打包的时间），并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用（一般都以import方式引用使用），那就可以通过配置externals。

这样做的目的就是将不怎么需要更新的第三方库脱离webpack打包，不被打入bundle中，从而减少打包时间，但又不影响运用第三方库的方式，例如import方式等。
#### externals支持模块上下文的方式

- global - 外部 library 能够作为全局变量使用。用户可以通过在 script 标签中引入来实现。这是 externals 的默认设置。

- commonjs - 用户(consumer)应用程序可能使用 CommonJS 模块系统，因此外部 library 应该使用 CommonJS 模块系统，并且应该是一个 CommonJS 模块。

- commonjs2 - 类似上面几行，但导出的是 module.exports.default。

- amd - 类似上面几行，但使用 AMD 模块系统。

#### 怎么运用externals

例如：

在`index.html`中引入CDN的资源react全家桶之类的资源

```
      <script src="https://lib.baomitu.com/react/16.4.0-alpha.7926752/cjs/react.development.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.3.2/cjs/react-dom-server.browser.development.js
"></script>
     
```
webpack.config.js配置如下：

```
  module.exports = {
     ...
     output: {
       ...
     },
     externals : {
       react: 'react',
       redux: 'redux'
     }
     ...
   }

```
这样的话在应用程序中依旧可以以import的方式（还支持其他方式）引用：

```
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';

```
这样不仅之前对第三方库的用法方式不变，还把第三方库剥离出webpack的打包中，从而加速webpack的打包速度。

#### externals和libraryTarget的关系

- libraryTarget配置如何暴露 library。如果不设置library,那这个library就不暴露。就相当于一个自执行函数

- externals是决定的是以哪种模式去加载所引入的额外的包

- libraryTarget决定了你的library运行在哪个环境，哪个环境也就决定了你哪种模式去加载所引入的额外的包。也就是说，externals应该和libraryTarget保持一致。library运行在浏览器中的，你设置externals的模式为commonjs，那代码肯定就运行不了了。

- 如果是应用程序开发，一般是运行在浏览器环境libraryTarget可以不设置，externals默认的模式是global，也就是以全局变量的模式加载所引入外部的库。
