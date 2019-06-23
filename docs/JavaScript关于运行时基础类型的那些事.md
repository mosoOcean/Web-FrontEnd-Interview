### JavaScript关于运行时基础类型的那些事

运行时类型为在代码实行过程中用到的类型。包括7大基础类型：

* undefined
* null
* boolean
* number
* string
* object
* symbol

##### Undefined
Undefined 类型表示“未定义“，它的类型只有一个值，就是undefined。并且undefined是全局对象的属性，也就是它是一个全局变量。这个变量undefined的值就是undefined。在ES5以后，这个全局的undefined变量是只读不可以改写的。

问题：为什么有的编程规范要求用 void 0 代替 undefined?

虽然ES5以后，全局的undefined变量是只读不可以改写的。但是undefined在JavaScript的代码中是一个变量，并不是一个关键字。在局部变量过程还是能改写undefined的。
例如：

```
function changeUndefined () {
    var undefined = 1;
    console.log(undefined);
}
changeUndefined(); // 1
```
void是JavaScript的一个操作符，而void 0无论什么时候都是返回undefined，这样来看，使用void 0来代替undefined就比较稳妥，不会出错。

```
console.log(void 0) // undefined
console.log(void 0 === undefined) // true
```

##### Null
Null 跟Undefined 有一定的表意差别，null表示“定义了并没值”；当检测 null 或 undefined 时，注意相等（==）与全等（===）两个操作符的区别 ，前者会执行类型转换：

```
typeof null        // "object" (因为一些以前的原因而不是'null')
typeof undefined   // "undefined"
null === undefined // false
null  == undefined // true
null === null // true
null == null // true
!null //true
isNaN(1 + null) // false
isNaN(1 + undefined) // true
```