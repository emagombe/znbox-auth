const path = require('path');

module.exports = {
	mode: "development", // "production" | "development" | "none"
	entry: {
		app: path.resolve(__dirname, 'src/app.jsx'), // string | object | array
		signin: path.resolve(__dirname, 'src/signin.jsx'),
		signup: path.resolve(__dirname, 'src/signup.jsx'),
	},
	output: {
		publicPath: '/',
		filename: '[name].js',
		path: path.resolve(__dirname, "public/static/js"), // string
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	devServer: {
		contentBase:  ['./src', './public'],
		host: 'localhost',
		port: 8080,
		historyApiFallback: true,
	}
};