const withTypescript = require("@zeit/next-typescript");
const withLess = require('@zeit/next-less');
const withPlugins = require("next-compose-plugins");
const { ANALYZE } = process.env
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => { }
}
const nextConfigs = {
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
        },
        {
          loader: "ts-loader",
        },
      ],
    }, 
    // {
    //     test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    //     use: [
    //       {
    //         loader: 'babel-loader',
    //       },
    //       {
    //         loader: '@svgr/webpack',
    //         options: {
    //           babel: false,
    //           icon: true,
    //         },
    //       },
    //     ],
    //   }
    );
    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};




module.exports = withPlugins([
  withTypescript,
  [withLess, {
    lessLoaderOptions: {
      javascriptEnabled: true
    },
  }]
], nextConfigs);