const path = require("path")

module.exports = {
  mode: "development",
  entry: "./index.ts",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json", ".less"],
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: "swc-loader",
        },
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "example"),
  },
}
