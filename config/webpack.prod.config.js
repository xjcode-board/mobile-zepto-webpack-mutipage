const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')
const {
  resolve
} = require('path')

module.exports = {
  devtool: false,
  mode: 'production',
  module: {
    rules: [{
      test: /\.(scss|sass)$/,
      include: [
        resolve("src"),
      ],
      use: [{
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            ident: 'postcss',
            plugins: (loader) => [
              require('postcss-import')({
                root: loader.resourcePath
              }),
              require('postcss-cssnext')(),
              require('autoprefixer')(),
              require('cssnano')(),
              require('postcss-px-to-viewport')({
                viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
                viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
                unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
                viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
                selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
                minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
                mediaQuery: false // 允许在媒体查询中转换`px`
              }),
              require('postcss-write-svg')({
                utf8: false
              }),
              require('postcss-aspect-ratio-mini')(),
            ]
          }
        },
        {
          loader: 'sass-loader'
        },
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production'
    }),
    new MiniCssExtractPlugin({
      filename: chunkData => chunkData.chunk.name.includes('/') ? '[name].[contenthash:8].css' : 'css/[name].[contenthash:8].css',
      chunkFilename: "css/[name].[contenthash:8].css",
    })
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        cache: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: {
      name: 'manifest'
    },
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
          filename: 'js/vendors.[contenthash:8].js',
          priority: 2,
          reuseExistingChunk: true
        },
        common: {
          test: /\.m?js$/,
          chunks: 'all',
          name: 'common',
          filename: 'js/common.[contenthash:8].js',
          minSize: 0,
          minChunks: 2,
          priority: 1,
          reuseExistingChunk: true
        }
      }
    }
  },
}