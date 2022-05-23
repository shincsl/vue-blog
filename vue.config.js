// module.exports = {
//   devServer: {
//     proxy: {
//       "/api": {
//         target: "http://120.78.199.215:9000/",
//         changeOrigin: true,
//         pathRewrite: {
//           "^/api": ""
//         }
//       }
//     },
//     disableHostCheck: true
//   },
//   lintOnSave: false,
// };
module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,//process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: 8080,
        open: false,//是否自动打开浏览器
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            '/api': {
                target: "http://120.78.199.215:9000/",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}