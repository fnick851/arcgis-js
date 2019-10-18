const path = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const config = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[contenthash].js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.svg$/,
                use: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".vue"]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: require("html-webpack-template"),
            inject: false,
            appMountId: "app"
        })
    ],
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\\/]node_modules[\\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9999
    }
}

module.exports = config
