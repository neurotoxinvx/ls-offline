# LSOffline Plugin

WebPack 静态资源离线化插件

### 为什么选择 LSOffline Plugin

友好，无需更换构建工具全家桶

简单，仅需搭配 html-webpack-plugin 即可运行

省心，每次上线自动更新本地离线资源



### 依赖

1.ls-offline 依赖 html-webpack-plugin ，请务必安装 html-webpack-plugin

2.请在调用 ls-offline 之前调用 html-webpack-plugin，并且将 html-webpack-plugin 的 `inject` 选项置为 `false`

3.首次加载静态资源时使用 XMLHttpRequest 请求资源，所以在使用 ls-offline 前请为你的静态资源开启跨域(CORS)，如果未开启跨域将会报错且无法正常运行 ls-offline



### 安装

```shell
npm install ls-offline --save-dev
```



### 快速开始

webpack.config.js

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin')
var LSOffline = require('ls-offline')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      inject: false
    }),
    new LSOffline()
  ]
}
```



### DEMO

```shell
git clone https://github.com/neurotoxinvx/ls-offline.git
cd ls-offline
npm install
npm run demo
```



### 参数

##### 参数传入

```javascript
new LSOffline({
  cache: true,
  debug: false
})
```



##### 参数列表:

###### 1.debug

类型: Boolean

默认: `false`

是否开启 debug 模式，开启 debug 模式后 client 端代码不会进行压缩混淆。默认为 `false`

###### 2.cache

类型: Boolean

默认: `true`

是否启用 localStorage 离线化。默认为 `true`
