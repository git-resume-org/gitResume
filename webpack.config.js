const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    bundle: path.resolve(__dirname, "client/index.jsx"), // The entry point for our application.
  },
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory for the bundled files.
    filename: "js/[name][contenthash].js", // Name of the bundled JavaScript file.
    clean: true, // Clean the "dist" directory before each build.
    assetModuleFilename: "assets/[name][ext]", // Asset filenames for images and other files.
  },
  // devtool: 'inline-source-map',
  devtool: "source-map", // Generate source maps for easier debugging.
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Serve static files from the "dist" directory.
    },
    compress: false, // if true, compresses assets to speed up server responses.
    port: 3000, // Port number for the development server.
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },

    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "gitRésumé", // The title of the generated HTML file.
      filename: "index.html", // The name of the generated HTML file.
      template: "client/template.html", // Use the "template.html" file as the base for the generated HTML.
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: 'client/**/**/*.scss',
      failOnError: true,
      quiet: true,
    }),
    // new CopyPlugin({
    //   patterns: [
    //     { from: 'client/assets', to: 'assets' },
    //   ],
    // }),
  ],
};
// webpack config from: https://medium.com/@herman.zuiakov/building-a-webpack-starter-template-with-scss-bootstrap-and-tailwind-css-support-cc729e9619f4
