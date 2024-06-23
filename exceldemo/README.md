# exceldemo

> a excel demo
> 这里要做一个excel的导出demo
> 20230508

# 20240622再次更新
这次把代码clone下来，因为从window换成了macos，导致npm install出现了问题，果然是node-sass的问题；
最好的解决方法就是：把node-sass的依赖去掉换成sass，注意sass版本问题即可；

> 这次是完善下这个前端生成excel功能，支持多个sheet导出
> 这样的功能一般就是用于，前端对大量的数据进行数据分割展示，避免一个sheet过大过多；
> 这个小功能也是自己最近公司的功能总结下来的
个人理解这个原理就是：多个sheet的逻辑就是给每个ws对应上数据和唯一的sheet名，然后把每个ws都追加到wb创建的excel中，然后用writeFile写文件

> 另外看了下源码，这个版本的xlsx依赖似乎没有 writeFileXLSX 方法，高一些版本的xlsx依赖有这个方法，可以看情况使用


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
