const path = require('path');

// ... contents of webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/main.js',
    },

// ... contents of webpack.config.js
    // ...previous Webpack config...
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // ...additional rules...
        ],
    },

    // ...previous Webpack config...
    module: {
        rules: [
            // ...additional rules...
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    // ...previous Webpack config...
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
    ],
};