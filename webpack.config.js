const defaultsDeep = require("lodash.defaultsdeep");
const path = require("path");
const webpack = require("webpack");

// Plugins
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// PostCss
const autoprefixer = require("autoprefixer");
const postcssconsts = require("postcss-simple-vars");
const postcssImport = require("postcss-import");

const STATIC_PATH = process.env.STATIC_PATH || "/static";

const base = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: "cheap-module-source-map",
    devServer: {
        contentBase: path.resolve(__dirname, "build"),
        host: "0.0.0.0",
        port: process.env.PORT || 3000,
        historyApiFallback: true,
    },
    output: {
        library: "GUI",
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
                loader: "babel-loader",
                include: [
                    path.resolve(__dirname, "src"),
                    /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                    /node_modules[\\/]pify/,
                    /node_modules[\\/]@vernier[\\/]godirect/,
                ],
                options: {
                    // Explicitly disable babelrc so we don't catch constious config
                    // in much lower dependencies.
                    babelrc: false,
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-transform-async-to-generator",
                        "@babel/plugin-proposal-object-rest-spread",
                        "@babel/plugin-transform-runtime",
                    ],
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                },
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                include: [
                    path.resolve(__dirname, "src"),
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
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/,
            }),
        ],
    },
    plugins: [],
};

if (!process.env.CI) {
    base.plugins.push(new webpack.ProgressPlugin());
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
                name: "lib.min",
            },
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": '"' + process.env.NODE_ENV + '"',
                "process.env.DEBUG": Boolean(process.env.DEBUG),
                "process.env.GA_ID": '"' + (process.env.GA_ID || "UA-000000-01") + '"',
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'gui'],
                template: './src/index.ejs',
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "static",
                        to: "static",
                    },
                ],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "node_modules/scratch-blocks/media",
                        to: "static/blocks-media",
                    },
                ],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "extension-worker.{js,js.map}",
                        context: "node_modules/scratch-vm/dist/web",
                    },
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