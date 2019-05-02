### 为什么会出现RESTful
先不要急着知道RESTful到底是什么，它没那么高深的。要想清楚的知道RESTful，首先回顾下HTTP协议，以及API（Application Programming Interface,应用程序编程接口）。这样可以知道RESTful的来历及意义所在。


* API

	应用程序编程接口，说白了就是预定义一些功能，供其他调用，从而做到提供服务的作用。
	

* HTTP
 在这里不说具体HTTP的含义，及相关基础的概念。想了解可以参考**《图解HTTP》**这本书，讲的很详细也很生动。在这里只想说说HTTP协议的基本构成。


 HTTP协议工作于客户端-服务端架构为上。浏览器作为HTTP客户端通过URL向HTTP服务端即WEB服务器发送所有请求。Web服务器根据接收到的请求后，向客户端发送响应信息。这里就涉及到HTTP请求Request）和响应（Response），对于一个完整的请求（Request）、响应（Response）来说，还是有一定规范的（有套路的），这里我们看一下HTTP请求和响应的一些基本信息。
 
 举个栗子：


 我们用Fiddler抓了一下360浏览器的任务中心的API接口信息，如下是它的请求信息：
 
 ```
 GET http://task.browser.360.cn/online/setpoint HTTP/1.1
Accept: */*
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
Pragma: no-cache
Content-Type: application/x-www-form-urlencoded
Host: task.browser.360.cn
Content-Length: 449
Cookie:__guid=91251416.3523784108665864700.1520256100246.427D%25PO%25QR%25P9%25R1%25P0%25RS%25O5%25P4%25PO%25N7%25
 ```
得到的服务器响应结果，如下所示：

	```
	HTTP/1.1 200 OK
	Server: nginx/1.6.3
	Date: Sat, 10 Mar 2018 03:37:00 GMT
	Content-Type: text/html; charset=utf-8
	Transfer-Encoding: chunked
	Connection: close

	{"errno":"10003","errmsg":"\u7b7e\u540d\u9519\u8bef"}
```


我们可以看到：


 * 请求Request ：
 
    1. 请求的方式 GET


    2. 请求的地址 URL（http://task.browser.360.cn/online/setpoint）


    3. 版本号（HTTP/1.1）


    4. 请求的头部信息，headers（Accept，Host，cookie等在于此处存着）


    5. 附属体信息 （通常为自定义传的参数，这里并没有体现）

 * 响应Response ：

	1. 版本号
	2. 状态码 （http协议的状态码）
	3. 相应头部信息headers （时间、数据格式、编码等信息）
	4. 附属体信息（通常为相应的自定义数据体）


那么问题来了，既然HTTP协议是有其规则的，那么我们在设计API的时候，也应该有一定的规则。这里头最有名的就是RESTful API规范了。

### RESTful为何物？


首先来解释下它的直面意思，它是**Representational State Transfer**的缩写，翻译过来就是“**表现层状态转换**”。（直面意思都这么高深的样子）其实这里省略了它的主语resource(资源)，即resource representational state transfer(资源表现层状态转换)。那资源指的又是什么呢？表现层又是什么？状态转化是做了什么呢？


* **resource（资源）**：其实就是网络上的某个信息，例如一段文本、一张图片、一首歌曲等。每个资源对应一个特定的URL。要获取这个资源，访问它的URL就可以，因此URI就成了每一个资源的地址或独一无二的识别符。

* **representation(表现层)**："资源"是一种信息实体，它可以有多种外在表现形式。比如，一段文本我们可以用md格式或者txt等格式表现；图片可以用JPG格式表现，也可以用PNG格式表现。我们把"资源"具体呈现出来的形式，叫做它的"表现层"。因此所说的表现层是建立在资源上的。

	
	
* **state transfer(状态转换)**：我们知道，客户端与服务端是一种互动的关系，这就意味着，客户端的操作会改变服务端资源的状态，这种状态的变换叫做state transfer(状态转换)，而这种状态转换是基于表现层，也就是说是对资源表现层的状态转换。所以就是"表现层状态转化"。

我们知道客户端操作是通过HTTP请求对服务端资源操作的，HTTP/1.1中，请求方法有（GET, POST, PUT, PATCH, DELETE）这些，并且有具体的含义。
 
 ```
 GET（SELECT）：从服务器取出资源（一项或多项）。
 POST（CREATE）：在服务器新建一个资源。
 PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
 PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
 DELETE（DELETE）：从服务器删除资源。
 ```
 介绍上面基本概念后，总结下RESTful到底是什么，它就是：**利用HTTP的请求方法去操作URL定位的资源，它是一种客户端与服务端交互的一种规范**。它的核心思想就是：**URL只负责描述需要操作的资源，所以URL里头不应该有动词，应该是名词。HTTP负责描述操作。**
 
### RESTful示例

例如一个关于组织机构的API设计应该这样：

```
http://www.organization.com/orgs
http://www.organization.com/departments
http://www.organization.com/staffs

```
基于请求的方式和路径来作为常见的CURD（增删改查）

```
GET /orgs 列出所有组织
POST /orgs 新增一个或多个组织
GET /orgs/ID 查询某个组织
PUT /orgs/ID 更新某个组织
DELETE /orgs/ID 删除某个组织
GET /orgs/ID/departments 查询某个组织下的所有部门
DELETE /orgs/ID/departments/ID/staffs 查询某个组织下的某个部门的所有员工
```
对于请求后的响应结果，RESTful也做了一个很好得定义：

```
GET /orgs：返回资源对象的列表（数组）
GET /orgs/resource：返回单个资源对象
POST /orgs：返回新生成的资源对象
PUT /orgs/resource：返回完整的资源对象
DELETE /orgs/resource：返回一个空文档
```
### RESTful设计误区

最常见的一种设计错误，就是URI包含动词。因为"资源"表示一种实体，所以应该是名词，URL不应该有动词，动词应该放在HTTP协议中。

### RESTful优点
* URL具有很强可读性的，具有自描述性
* 可提供OpenAPI，便于第三方系统集成，提高互操作性；

### RESTful的缺点
* 请求路径将表内关系完全暴露，响应结果将表结构暴露，



