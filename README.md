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
new LSOffline(options)
```

- version : 版本号，用于本地缓存对比是否需要请求更新静态资源，建议传入 package.json 中的 version。