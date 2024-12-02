module.exports = {
    mode: 'development',
    devServer: {
        static:'./dist'
    },
    module: {
        rules: [
            {
              test: /\.(jsx?)$/,
              use: ['babel-loader'],
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
              test: /\.(png|jpe?g|gif|svg|otf|mp4)$/i,
              use: ['file-loader'],
            },
          ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
}