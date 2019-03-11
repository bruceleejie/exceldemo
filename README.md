# exceldemo
a demo of exporting excel file

这是我项目中需要用到excel文件导出功能，在这里做个小总结。

1、本demo是用vue+webpack+element框架搭建并开发的。想要在vue项目中使用excel导出功能，需要先引入几个依赖：

> npm install -S file-saver xlsx // 合理安装了两个依赖
> 
> npm install -D scropt-loader

2、在src目录下新建一个excel的文件夹，放入Blob.js和Export2Excel.js两个文件。

3、在点击事件的方法中编写相关代码。
