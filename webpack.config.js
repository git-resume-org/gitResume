const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
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
    port: 3000, // Port number for the development server
    hot: true, // Enable hot module replacement
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Babel presets for JavaScript and React
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/, // Loader for TypeScript files
      },
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
    // Uncomment if you need to copy static assets
    // new CopyPlugin({
    //   patterns: [
    //     { from: 'client/assets', to: 'assets' },
    //   ],
    // }),
  ],
};
