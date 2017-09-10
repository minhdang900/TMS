var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
      './src/app_aba.js',
   // './src/esmile_vinpearl', 
   //   './src/esmile_mobile', 
   // './src/common/app.common',
   // './src/common/app.api',
    './src/common/app.plugin'
    
  ],
  module: {
    loaders: [
      { test: /\.js?$/,  loader: 'babel-loader?presets[]=es2015&presets[]=react', exclude: /node_modules/ },
      { test: /\.s?css$/, loader: 'style!css!sass' },
    ]
  },
  resolve: {
	root: path.resolve(__dirname, 'src'),
    extensions: ['', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'app_aba_dev.js'//'elcom_esmile_dangtm.js'//
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
//    new webpack.DefinePlugin({
//    	  'process.env': {
//    	    NODE_ENV: JSON.stringify('production')
//    	  }
//    }),
//    new webpack.optimize.UglifyJsPlugin()
//    new webpack.optimize.UglifyJsPlugin({
//	    compress: {
//	      warnings: false // https://github.com/webpack/webpack/issues/1496
//	    }
//	})
  ]
};
