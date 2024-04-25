//自定义配置
const path = require("path"); // 引入path模块
const webpack = require("webpack");
require("events").EventEmitter.defaultMaxListeners = 50; //增加侦听器限额  防止内存泄漏
function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProd = process.env.NODE_ENV === "production";
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const port = process.env.port || process.env.npm_config_port || 80 // 端口

module.exports = {
  publicPath: process.env.PUBLIC_PATH, // 前端代理
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://42.193.49.116:2022/canteen",
        changeOrigin: true,
        pathRewrite: {
          "^/api/": "/", //重写路径
        },
      },
    },
  },
  productionSourceMap: false,

  configureWebpack: (config) => {
    /** moment优化 */
    if (isProd) {
      config.plugins.push(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
      );
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {comments: false},
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log"],
            },
          },
        })
      );
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      //第一个参数：别名 第二个参数：路径
      .set("@", resolve("src"))
      .set("@components", resolve("src/components"))
      .set("@assets", resolve("src/assets"))
      .set("@views", resolve("src/views"))
      .set("@utils", resolve("src/utils"))
      .set("@router", resolve("src/router"))
      .set("@validate", resolve("src/validate"));
    config.performance.set("hints", false);
  },
};
