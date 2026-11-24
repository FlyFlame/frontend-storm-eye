import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	mode: 'development',
	entry: {
		analysis: './src/pages/Analysis-page/analysis-page.js',
		dashboard: './src/pages/Dashboard/dashboard.js',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	devtool: 'eval-source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		open: true,
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.html$/i,
				use: 'html-loader',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/pages/Dashboard/dashboard.html',
			filename: 'index.html',
			chunks: ['dashboard'],
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/Dashboard/dashboard.html',
			filename: 'dashboard.html',
			chunks: ['dashboard'],
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/Analysis-page/analysis-page.html',
			filename: 'analysis.html',
			chunks: ['analysis'],
		}),
	],
};
