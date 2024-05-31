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
    bundle: path.resolve(__dirname, 'client/index.tsx'), // Entry point for our application
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files
    filename: 'js/[name][contenthash].js', // Name of the bundled JavaScript file
    clean: true, // Clean the "dist" directory before each build
    assetModuleFilename: 'assets/[name][ext]', // Asset filenames for images and other files
  },
  devtool: 'source-map', // Generate source maps for easier debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve static files from the "dist" directory
    },
    compress: false, // If true, compresses assets to speed up server responses
    port: 8080, // Port number for the development server
    hot: true, // Enable hot module replacement,
    proxy: [{
      context: '/api',
      target: 'http://localhost:3000',
      secure: false,
    }],
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'], // Loaders for SCSS files
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'], // Loaders for CSS files
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
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/, // Loader for TypeScript files
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Asset module for image files
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'gitRésumé', // Title of the generated HTML file
      filename: 'index.html', // Name of the generated HTML file
      template: 'client/template.html', // Use the "template.html" file as the base for the generated HTML
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: 'client/**/**/*.scss', // Lint SCSS files in the client directory
      failOnError: true,
      quiet: true,
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'REACT_APP_GH_CLIENT_ID': JSON.stringify(process.env.REACT_APP_GH_CLIENT_ID),
      },
    }),
  ],
};
