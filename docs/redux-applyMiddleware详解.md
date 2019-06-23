#### 使用方式

`const store = applyMiddleware(...middlewares)(createStore)(reducer, initialState)`

	
```sh
function applyMiddleware() {
    //1
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }
  //2
  return function (createStore) {
      //3
    return function (reducer, preloadedState, enhancer) {
      //4
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];
      //5
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      //6
      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
```


applyMiddleware方法主要是对redux的dispacth方法进行封装

接下来具体分析 applyMiddleware 函数

1. 代码//1

```sh
for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
}
```
由于第一个框号(...middlewares)里面的参数可以是多个中间件(m1,m2,m3)这种类型，或者是一个中间件数组
所以这里通过 遍历 js函数的 arguments 属性将所有的参数取出放到 middlewares 数组中

2. 代码//2 //3

applyMiddleware 这个函数其实是一个 柯里化 的函数，
柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，
并且返回接受余下的参数且返回结果的新函数的技术

这里有几个关键字 多个参数 单一参数 返回接受余下参数的函数 返回结果
//举例

```sh
function count(a,b,c) {
    return a+b+c;
}
count(1,2,3);
```
我们看到 count接受多个参数，这里是三个，最后返回了计算结果，接下来把它柯里化

```sh
function count(a) {
    return function(b) {
        return function(c) {
            return a+b+c;
        }
    }
}
count(1)(2)(3);
```
我们看到区别在于 柯里化 后函数只接受一个参数，返回了接受剩余参数的函数，所以要分多次调用

3. //代码4

```sh
var store = createStore(reducer, preloadedState, enhancer);
var _dispatch = store.dispatch;
var chain = [];
```

这里做了三件事情，1 用reducer创建了一个 store，2 var _dispatch = store.dispatch; 将原来的
dispatch方法保存了起来，因为后我们要覆盖 dispach 但又要用到原始的dispatch的功能，所以保存
3 var chain = [];我们的中间件也是一个 柯里化 的函数，这个数组用来保存中间件接受第一个参数
后返回的函数

4. //代码5

```sh
var middlewareAPI = {
    getState: store.getState,
    dispatch: function dispatch(action) {
      return _dispatch(action);
    }
};
chain = middlewares.map(function (middleware) {
    return middleware(middlewareAPI);
});
```

middlewareAPI 对象有两个成员 getState和dispatch，由于这两个成员我们会在中间件里面用到
所以我们要将它们传递给中间件 调用 middlewares.map 方法，middlewares是一个数组，map方法
接受一个函数，这个函数的第一个参数就是 middlewares 数组的成员，我们调用map方法会遍历
middlewares数组，将它的每一个成员传递给 成员处理函数，最终返回了一个由 处理函数返回值
组成的数组，通过以上代码我们就可以在中间件中使用getState，和dispatch这两个方法了

5. //代码6

```sh
_dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
return _extends({}, store, {
        dispatch: _dispatch
});
```

这里做的事情就是我们开始的原理中做的事情 将 disatch 增强并且替换掉store中的dispatch，
替换后的dispach中会调用中间件，我们看到返回值_extends 是一个函数，接收store，和增强后
的_dispatch，用来替换自己的 dispatch方法