/**
 * 不同形式异步，回调函数的执行顺序情况
 */
// 今日头条面试题

async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('settimeout')
})
async1()
new Promise(function (resolve) {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end')

//script start
//console.log('async1 start')
// console.log('async1 end')
//console.log('promise1')
//console.log('script end')
//console.log('settimeout')
//console.log('async2')
//console.log('promise2')