const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "..", "src", "ui", "index.js"),
    output: {
        path: path.join(__dirname, "..", "dist"),
        filename: "bundle.development.js",
    },
    resolve: {
        extensions: [".js", ".vue", ".css"],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015"]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: "vue-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("bundle.development.css"),
        new HtmlPlugin({
            template: path.join(__dirname, "..", "static", "index.html")
        })
    ]
};
