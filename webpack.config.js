const defaultsDeep = require("lodash.defaultsdeep");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

// Plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// PostCss
const autoprefixer = require("autoprefixer");
const postcssconsts = require("postcss-simple-vars");
const postcssImport = require("postcss-import");

let configParsed = null;

try {
	configParsed = dotenv.config({
		path: path.resolve(__dirname, ".env"),
	}).parsed;
} catch (error) {
	configParsed = null;
}

if (!configParsed) {
	configParsed = {
		NODE_ENV: "development",
		HOST: "localhost",
		PORT: 3000,
		...((process && process.env) || {}),
	};
}

const CONFIG_PREFIX = "REACT_APP_";

const filteredConfig = Object.keys(configParsed).reduce((pv, configKey) => {
	if (configKey === "DEBUG") {
		return { ...pv, [configKey]: configParsed[configKey].toLowerCase() === "true" };
	}

	if (configKey === "NODE_ENV" || configKey.startsWith(CONFIG_PREFIX)) {
		return { ...pv, [configKey]: configParsed[configKey] };
	}

	return pv;
}, {});

const STATIC_PATH = process.env.STATIC_PATH || "/static";

const base = {
	mode: configParsed.NODE_ENV === "production" ? "production" : "development",
	devtool: "cheap-module-source-map",
	devServer: {
		contentBase: path.resolve(__dirname, "build"),
		host: configParsed.HOST,
		port: configParsed.PORT || 3000,
		historyApiFallback: {
			index: "/",
			disableDotRule: true,
		},
	},
	output: {
		library: "GUI",
		publicPath: "/",
		filename: "[name].js",
		chunkFilename: "chunks/[name].js",
	},
	resolve: {
		symlinks: false,
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "swc-loader",
				include: [
					path.resolve(__dirname, "src"),
					/node_modules[\\/]scratch-[^\\/]+[\\/]src/,
					/node_modules[\\/]pify/,
					/node_modules[\\/]@vernier[\\/]godirect/,
				],
				exclude: [path.resolve(__dirname, "src", "third-party")],
			},
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				include: [
					path.resolve(__dirname, "src", "third-party"),
					/node_modules[\\/]scratch-[^\\/]+[\\/]src/,
					/node_modules[\\/]pify/,
					/node_modules[\\/]@vernier[\\/]godirect/,
				],
				options: {
					// Explicitly disable babelrc so we don't catch constious config
					// in much lower dependencies.
					babelrc: false,
					plugins: [
						[
							"react-intl",
							{
								messagesDir: "./translations/messages/",
							},
						],
					],
					presets: ["@babel/preset-env", "@babel/preset-react"],
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: "[name]_[local]_[hash:base64:5]",
							camelCase: true,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: function () {
								return [postcssImport, postcssconsts, autoprefixer];
							},
						},
					},
				],
			},
		],
	},
	optimization: {},
	plugins: [],
};

if (!process.env.CI) {
	base.plugins.push(new webpack.ProgressPlugin());
}

base.plugins.push(new CleanWebpackPlugin());

if (filteredConfig.NODE_ENV === "production") {
	base.optimization.minimize = true;
	base.optimization.minimizer = [
		new TerserPlugin({
			include: /\.min\.js$/,
		}),
	];
}

module.exports = [
	// to run editor examples
	defaultsDeep({}, base, {
		entry: {
			"lib.min": ["react", "react-dom"],
			gui: "./src/index.js",
		},
		output: {
			path: path.resolve(__dirname, "build"),
			filename: "[name].js",
		},
		module: {
			rules: base.module.rules.concat([
				{
					test: /\.(svg|png|wav|gif|jpg)$/,
					loader: "file-loader",
					options: {
						outputPath: "static/assets/",
					},
				},
			]),
		},
		optimization: {
			splitChunks: {
				chunks: "all",
				name: "lib.min",
			},
			runtimeChunk: {
				name: "lib.runtime.min",
			},
		},
		plugins: base.plugins.concat([
			new webpack.DefinePlugin({
				"process.env": JSON.stringify(filteredConfig),
			}),
			new HtmlWebpackPlugin({
				chunks: ["lib.min", "gui"],
				template: "./src/index.ejs",
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: "static",
						to: "static",
					},
					{
						from: "node_modules/scratch-blocks/media",
						to: "static/blocks-media",
					},
					{
						from: "extension-worker.{js,js.map}",
						context: "node_modules/scratch-vm/dist/web",
					},
					{
						from: "node_modules/react-toastify/dist/ReactToastify.min.css",
						to: "static/ReactToastify.min.css",
					}
				],
			}),
		]),
	}),
];
/*
.concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
        // export as library
        defaultsDeep({}, base, {
            // target: 'web',
            target: ['web', 'es5'],
            entry: {
                'scratch-gui': './src/index.js'
            },
            output: {
                libraryTarget: 'umd',
                path: path.resolve('dist'),
                publicPath: `${STATIC_PATH}/`
            },
            externals: {
                'react': 'react',
                'react-dom': 'react-dom'
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|gif|jpg)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/assets/',
                            publicPath: `${STATIC_PATH}/assets/`
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'node_modules/scratch-blocks/media',
                            to: 'static/blocks-media'
                        }
                    ]
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'extension-worker.{js,js.map}',
                            context: 'node_modules/scratch-vm/dist/web'
                        }
                    ]
                }),
                // Include library JSON files for scratch-desktop to use for downloading
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/lib/libraries/*.json',
                            to: 'libraries',
                            flatten: true
                        }
                    ]
                })
            ])
        })) : []
);
*/
