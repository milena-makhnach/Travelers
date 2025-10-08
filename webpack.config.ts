import path from 'path';
import { Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

type ConfigModule = NonNullable<Configuration['module']>;

const deServerConfig: DevServerConfiguration = {
  port: 3000,
  compress: true,
  hot: true,
  open: true,
  historyApiFallback: true,

  static: {
    directory: path.resolve(__dirname, 'dist'),
  },
};

const plugins = (mode: Configuration['mode']): Configuration['plugins'] => {
  const isDev = mode === 'development';

  return [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      scriptLoading: 'defer',
      inject: 'body',
    }),
    isDev ? undefined : new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ].filter(Boolean);
};

const loaders = (mode: Configuration['mode']): ConfigModule['rules'] => {
  const isDev = mode === 'development';

  return [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript',
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
        },
      },
    },
    {
      test: /\.css$/i,
      use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
    },
  ];
};

const devConfig = {
  devServer: deServerConfig,
  devtool: 'inline-source-map',
};

const config = (_: any, arg: { mode: Configuration['mode'] }): Configuration => ({
  mode: arg.mode,
  entry: path.resolve(__dirname, 'src/index.tsx'),
  module: {
    rules: loaders(arg.mode),
  },
  plugins: plugins(arg.mode),
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  ...(arg.mode === 'development' && devConfig),
});

export default config;
