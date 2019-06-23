### js中的this原理

#### this的定义


**this**指的是**函数运行时**所在的环境。（不是定义时所在的环境）

怎么理解这句话呢？看如下例子：

```
var w = 1;
var wFunction=function(){
    console.log(this.w)
}

var wObj = {
    w:2,
    wFunction:wFunction
}

wFunction()//1
wObj.wFunction()//2

```

在这个例子中，首先第一个输出，因为wFunction是运行在全局环境中，所以**this**指向全局环境，所以输出1；第二个输出，因为wFunction运行在wObj环境中，所以**this**指向wObj，而wObj的w属性值为2，所以输出2；

那么问题来了，为什么第二个说是在wObj环境中运行呢，运行环境是怎么来判别的呢？这得从内存的数据结构说起。

#### 内存的数据结构

首先，是考虑到内存的数据结构，才设计这个this的。那内存的数据结构是怎样的呢，先看个例子：

```
var wObj = {
	w:5
}

console.log(wObj.w)//5
```

这里，javaScript引擎会在内存里先生成一个对象{w:5}，然后把这个对象的内存地址（reference）赋值给wObj变量。

如果通过wObj.w来读取这个对象的属性w,则引擎会先从wObj这个变量拿到对象的内存地址，然后从该地址读出这个对象，返回w属性。

在看下面一个例子：

```
var wFunction = function(){
	...
}
var wObj = {
	wFunc:wFunction
}

console.log(wObj.wFunc())

```
这里，javaScript引擎会先将函数function(){...}**单独保存在内存中**。然后javaScript引擎会在内存里生成一个对象{wFunc:wFunction}，而wFunction则是函数的内存地址（reference）。然后把这个对象的内存地址赋值给wObj变量。

如果通过wObj.wFunc()执行函数，则引擎会先从wObj这个变量拿到对象的内存地址，然后从该地址读出这个对象，返回wFunc属性，而wFunc属性的值是函数function(){...}的内存地址（reference），因为这个**是单独的一个值，所以可以在不同环境（上下文）执行**。在这里函数是通过wObj找到的（wObj的属性wFunc），所以在wObj环境中执行的。

这里解释了为啥函数是可以在不同的环境中执行。那么问题来了，这动态的执行环境，怎么获取呢？

#### this设计机制

针对获取执行环境问题，**this**就这么设计出来了，它的设计目的就是在函数体内部，指代函数**当前的运行环境**。

回到文章开头例子，并加以深化如下：

```
var w = 1;
var wFunction=function(){
    console.log(this.w)
}

var wObj = {
    w:2,
    wFunction:wFunction
}

wFunction()//1
wObj.wFunction()//2

let wObjFunc = wObj.wFunction;
wObjFunc()//1

```
第一个输出，函数执行时，是通过全局变量wFunction找到函数引用地址的，它的执行环境则是全局，因此输出全局w，为1；

第二个输出，函数执行时，是通过wObj指向的对象里的wFunction属性找到的函数引用地址的，因此，它的执行环境则是wObj指向的对象，因此输出对象的w，为2；

第三个输出，函数执行时，是通过全局变量wObjFunc找到函数引用地址的，（因为let wObjFunc = wObj.wFunction;这直接把函数的引用地址直接赋给了全局变量wObjFunc，所以wObjFunc直接指向函数本身）它的执行环境则是全局，因此输出全局w，为1；



