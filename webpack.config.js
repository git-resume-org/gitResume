import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devMode = process.env.NODE_ENV !== 'production';

export default {
  mode: devMode ? 'development' : 'production',
  entry: {
    bundle: path.resolve(__dirname, 'client/index.tsx'), // The entry point for our application.
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files.
    filename: 'js/[name][contenthash].js', // Name of the bundled JavaScript file.
    clean: true, // Clean the "dist" directory before each build.
    assetModuleFilename: 'assets/[name][ext]', // Asset filenames for images and other files.
  },
  devtool: 'source-map', // Generate source maps for easier debugging.
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve static files from the "dist" directory.
      publicPath: '/',
    },
    compress: false, // If true, compresses assets to speed up server responses
    port: 8080, // Port number for the development server
    hot: true, // Enable hot module replacement,
    proxy: [{
      context: '/api',
      target: 'http://localhost:3000',
      secure: false,
      changeOrigin: true,
    }],
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
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
      title: 'gitRésumé', // The title of the generated HTML file.
      filename: 'index.html', // The name of the generated HTML file.
      template: 'client/template.html', // Use the "template.html" file as the base for the generated HTML.
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: 'client/**/**/*.scss',
      failOnError: true,
      quiet: true,
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};
