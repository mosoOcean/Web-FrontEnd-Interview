###关于同步运行gulp任务那些事
####背景
Gulp 默认将所有任务和步骤异步化运行。显而易见，Gulp 在效率上是有明显的提升的。但是如果需要同步执行任务序列时，比如我们进行资源打包之前，应该先清掉镜像文件目录dist中的资源。如果按照默认的配置去配置任务，就会出现问题。本文针对gulp同步任务中容易出错的地方做了总结及给出了可行的方案。

####gulp异步任务
因为任务是异步运行的，Gulp 便默认将并行运行所有任务；任务中的步骤也是异步的，因此各个步骤也是并行的。比如在下面的任务里，两个操作将会并行运行：

```
var gulp = require('gulp');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
gulp.task('less:dist', function () {
   //编译less然后压缩css并拷贝到dist
    gulp.src(['src/**/*.less'])
        .pipe(less())
        .pipe(minifycss())
        .pipe(rename(function (path) {
            path.extname = ".css"
        }))
        .pipe(gulp.dest('dist'));
    //压缩css并拷贝到dist
    gulp.src(['src/**/*.css'])
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));
});
```
再比如将build任务依赖clean,copy-common,package三个任务，执行build任务时，三个依赖的任务是并行进行的：

```
var gulp = require('gulp');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
gulp.task("copy-common", function () {
    gulp.src(['client/**/**','!client/dev.html','!client/index.hbs','build/**/**'])
    .pipe(rename(function (path) {
        path.dirname += '';
    }))
    .pipe(gulp.dest("./dist/pages/currency"))
})
//清空dist目录
gulp.task("clean",function(){
    console.log('清空 dist 目录下的资源')
   gulp.src('dist/*', {
        read: false
    })
        .pipe(clean({
            force: true
        }));
})
//生成生产war包
gulp.task("package", function () {
    gulp.src(['dist/**']).pipe(zip('dist.war')).pipe(gulp.dest('./'));
    console.info('package ok!');
});
gulp.task('build',['clean','copy-common1','package'])
```
####如何将gulp任务序列同步执行
[gulp官网](https://www.gulpjs.com.cn/docs/api/)指出：

> 默认的，task 将以最大的并发数执行，也就是说，gulp 会一次性运行所有的 task 并且不做任何等待。
> 
> 
> 如果你想要创建一个序列化的 task 队列(例如任务two依赖任务one)，并以特定的顺序执行，你需要做两件事：


> * 在 "one" 中，你加入一个提示，来告知什么时候它会完成：可以再完成时候返回一个 callback，或者返回一个 promise 或 stream，这样系统会去等待它完成。

>* 在 "two" 中，你需要添加一个提示来告诉系统它需要依赖第一个 task 完

代码如下：


```
var gulp = require('gulp');

// 返回一个 callback，因此系统可以知道它什么时候完成
gulp.task('one', function(cb) {
    // 做一些事 -- 异步的或者其他的
    cb(err); // 如果 err 不是 null 或 undefined，则会停止执行，且注意，这样代表执行失败了
});

// 定义一个所依赖的 task 必须在这个 task 执行之前完成
gulp.task('two', ['one'], function() {
    // 'one' 完成后
});

gulp.task('default', ['one', 'two']);

```
但是亲测了下，代码如下：

```
var gulp = require('gulp');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
gulp.task("copy-common1",['clean'], function (cb) {
    var err;
     gulp.src(['client/**/**','!client/dev.html','!client/index.hbs','build/**/**'])
    .pipe(rename(function (path) {
        path.dirname += '';
    }))
    .pipe(gulp.dest("./dist/pages"))
    cb(err)
})
//清空dist目录
gulp.task("clean",function(cb){
    var err;
    console.log('清空 dist 目录下的资源')
    gulp.src('dist/*', {
        read: false
    })
        .pipe(clean({
            force: true
        }));
        cb(err)
})
//生成生产war包
gulp.task("package",['copy-common1'], function () {
    gulp.src(['dist/**']).pipe(zip('dist.war')).pipe(gulp.dest('./'));
    console.info('package ok!');
});
```
执行package任务，发现会抛出错误如下：


```
[13:59:55] Starting 'clean'...
清空 dist 目录下的资源
[13:59:55] Finished 'clean' after 7.94 ms
[13:59:55] Starting 'copy-common1'...
[13:59:55] Finished 'copy-common1' after 3.43 ms
[13:59:55] Starting 'package'...
package ok!
[13:59:55] Finished 'package' after 2.08 ms
events.js:182
      throw er; // Unhandled 'error' event
      ^

Error: ENOENT: no such file or directory, lstat '/dist/pages/common/libs/css/bootstrap.min.css'
```
但是如果是返回stream就会正常同步运行任务序列，修改如下：

```
var gulp = require('gulp');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
gulp.task("copy-common1", ['clean'], function (cb) {
    return gulp.src(['client/**/**', '!client/dev.html', '!client/index.hbs', 'build/**/**'])
        .pipe(rename(function (path) {
            path.dirname += '';
        }))
        .pipe(gulp.dest("./dist/pages"))
})
//清空dist目录
gulp.task("clean", function (cb) {
    console.log('清空 dist 目录下的资源')
   return gulp.src('dist/*', {
        read: false
    })
     .pipe(clean({
        force: true
    }));
})
//生成生产war包
gulp.task("package", ['copy-common1'], function () {
    gulp.src(['dist/**']).pipe(zip('dist.war')).pipe(gulp.dest('./'));
    console.info('package ok!');
});
```
执行package任务，工作流正常：

```
[14:07:07] Starting 'clean'...
清空 dist 目录下的资源
[14:07:07] Finished 'clean' after 48 ms
[14:07:07] Starting 'copy-common1'...
[14:07:07] Finished 'copy-common1' after 127 ms
[14:07:07] Starting 'package'...
package ok!
[14:07:07] Finished 'package' after 1.85 ms
```
虽然问题已经解决了，但是会发现，我们这里的package任务依赖了copy-common1这个任务，copy-common1依赖了clean这个任务。这样做其实相当于package这个任务隐式地包含了copy-common1与clean这两个任务，这样会带来一些麻烦，比如我们已经通过gulp开启了前端服务，dist目录下已经是需要打包的资源了，只需要执行package打包下，上传服务器。但是这里执行package任务时又执行了前两个任务，先清掉再拷贝，重复了工作。还有很多其他的麻烦，不一一说明。

####如何优雅地将gulp任务序列同步执行
针对这个问题，国内外都出现了插件进行处理，例如国内的 `gulp-sequence` 以及国外的 `run-sequence`
例如上面这个例子我们可以利用`run-sequence`来优雅地解决顺序执行同步任务，如下：

```
var gulp = require('gulp');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var sequence = require('run-sequence');

gulp.task("copy-common1", function () {
    return gulp.src(['client/**/**', '!client/dev.html', '!client/index.hbs', 'build/**/**'])
        .pipe(rename(function (path) {
            path.dirname += '';
        }))
        .pipe(gulp.dest("./dist/pages"))
})
//清空dist目录
gulp.task("clean", function () {
    console.log('清空 dist 目录下的资源')
   return gulp.src('dist/*', {
        read: false
    })
     .pipe(clean({
        force: true
    }));
})
//生成生产war包
gulp.task("package", function () {
    gulp.src(['dist/**']).pipe(zip('dist.war')).pipe(gulp.dest('./'));
    console.info('package ok!');
});
gulp.task('runsequence', function (callback) {
    sequence('clean', 'copy-common1', 'package', callback)
})
```
执行`runsequence`任务，工作流正常：

```
[14:47:29] Starting 'runsequence'...
[14:47:29] Starting 'clean'...
清空 dist 目录下的资源
[14:47:29] Finished 'clean' after 46 ms
[14:47:29] Starting 'copy-common1'...
[14:47:29] Finished 'copy-common1' after 131 ms
[14:47:29] Starting 'package'...
package ok!
[14:47:29] Finished 'package' after 7.93 ms
[14:47:29] Finished 'runsequence' after 191 ms
```
这里需要注意的是，这里也是需要返回一个stream。



