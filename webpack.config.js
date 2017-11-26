const {CheckerPlugin} = require("awesome-typescript-loader");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "..", "src", "ui", "index.tsx"),
    output: {
        path: path.join(__dirname, "..", "build"),
        filename: "bundle.min.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".json"],
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
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new CheckerPlugin(),
        new ExtractTextPlugin("bundle.min.css"),
        new HtmlPlugin({
            template: path.join(__dirname, "..", "static", "index.html")
        })
    ]
};
