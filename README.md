
技术栈


这是一个 SpringBoot + Vue2 + Vue3 的产物，支持移动端自适应，配有完备的前台和后台管理功能。

前端技术：Vue2（博客系统），Vue3（IM 聊天室系统），Element UI（Vue2），Element-Plus UI（Vue3），Naive UI（Vue3）

后端技术：Java，SpringBoot，MySQL，Mybatis-Plus，t-io，qiniu-java-sdk，spring-boot-starter-mail

网站分两个模块：

博客系统：具有文章，表白墙，图片墙，收藏夹，乐曲，视频播放，留言，友链，时间线，后台管理等功能。

本网站采用前后端分离进行实现，两个前端项目通过Nginx代理，后端使用Java。

部署网站需要安装Nginx、Java、MySQL，然后打包前后端项目并部署。

文件服务可以使用七牛云，也可以使用服务器。默认使用服务器。

本地启动


Vue2：

1.npm install

2.npm run serve

Vue3：

1.npm install

2.npm run serve

SpringBoot：

1.导入SQL文件到数据库（poetry.sql）

2.配置数据库连接（application.yml里面的datasource信息）

3.启动（PoetryApplication）
