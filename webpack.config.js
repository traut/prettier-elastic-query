const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEMO_SRC_DIR = path.resolve(__dirname, 'src/demos/');
const DEMO_DEST_DIR = path.resolve(__dirname, 'dist/demos/');

const demoFiles = fs.readdirSync(DEMO_SRC_DIR).map(function(filename) {
    return {
        template: path.resolve(DEMO_SRC_DIR, filename),
        filename: path.resolve(DEMO_DEST_DIR, filename),
        inject: 'head',
    }
})

let plugins = demoFiles.map(function(details) {return new HtmlWebpackPlugin(details)});
plugins.unshift(new CleanWebpackPlugin());
plugins.unshift(new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify('production'),
        APP_ENV: JSON.stringify('browser')
    }
}))


module.exports = {
    entry: './src/main.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'prettier-elastic-query.min.js',
	},
    optimization: {
        minimize: true
    },
	module: {
		rules:[
			{
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ],
            },
		]
    },
    plugins: plugins,
};
