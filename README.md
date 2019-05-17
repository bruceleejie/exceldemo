# exceldemo
a demo of exporting excel file

> 需要声明的是：本demo并非本人独家原创，在网上借鉴了一些大佬的文章，谢谢相关的大佬。
> 还参考了github上PanJiaChen/vue-element-admin的excel模块的相关代码。

> 本人在Export2Excel.js文件中新增了适合自己的方法，可以给大家伙借鉴。
> 
> 如果看到的朋友想借鉴，请根据实际情况下载参考。

这是我项目中需要用到excel文件导出功能，在这里做个小总结。

1、本demo是用vue+webpack+element框架搭建并开发的。想要在vue项目中使用excel导出功能，需要先引入几个依赖：

> npm install -S file-saver xlsx // 这里安装了两个依赖
> 
> npm install -D scropt-loader

2、在src目录下新建一个excel的文件夹，放入Blob.js和Export2Excel.js两个文件。

3、在点击事件的方法中编写相关代码。

4、这里导出功能可以做成更加复杂的，比如用户选择导出类型（csv、xlsx），用户可自定义文件名称等。

> 20190517更新记
这次更新demo，自己根据公司业务新的实际需求又加了几个功能：excel导入功能，树形结构导入，树形结构导出。
