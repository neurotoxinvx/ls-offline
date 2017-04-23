# LSOffline Plugin

WebPack 静态资源离线化插件

### 为什么选择 LSOffline Plugin

友好，无需更换构建工具全家桶

简单，仅需搭配 html-webpack-plugin 即可运行

省心，关联 package.json 版本号后，每次上线自动更新本地离线资源

### 快速开始

```javascript
webpack.config.js

var version = require('./package.json').version
var HtmlWebpackPlugin = require('html-webpack-plugin')
var LSOffline = require('ls-offline')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      inject: false
    }),
    new LSOffline({
      version: version
    })
  ]
}

```

### 参数

```javascript
new LSOffline({
  version: '0.0.1',
  cache: true
})
```

##### 参数列表:

###### 1.version

类型: String

本地缓存版本号，用于本地缓存对比是否需要请求更新静态资源，建议传入 package.json 中的 version。

##### 注：更新资源请务必升级版本号

###### 2.page

类型: String

本地缓存项目名，用户区分同域名不同页面的存储资源 key

### 依赖

ls-offline 依赖 html-webpack-plugin ，请务必安装 html-webpack-plugin，并在调用 ls-offline 之前调用 html-webpack-plugin。

由于首次加载静态资源时使用 Ajax 请求资源，所以在使用 ls-offline 前请为你的静态资源开启跨域，如果未开启跨域将会报错。
