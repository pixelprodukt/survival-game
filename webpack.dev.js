const webpackCommon = require('./webpack.common');
const path = require('path');

module.exports = {
    ...webpackCommon,
    devtool: "inline-source-map",
    mode: "development",
    devServer: {
        open: true,
        port: 3000,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    }
};