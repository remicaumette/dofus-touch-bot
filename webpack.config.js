const path = require("path");
const {CheckerPlugin, TsConfigPathsPlugin} = require("awesome-typescript-loader");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "src", "renderer", "index.tsx"),
    output: {
        path: path.join(__dirname, "build"),
        filename: "bundle.min.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".json"],
        plugins: [new TsConfigPathsPlugin()]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
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
        new CheckerPlugin(),
        new ExtractTextPlugin("bundle.min.css"),
        new HtmlPlugin({
            template: path.join(__dirname, "static", "index.html")
        })
    ]
};
