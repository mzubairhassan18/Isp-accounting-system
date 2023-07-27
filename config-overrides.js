const { override, addLessLoader } = require('customize-cra');

module.exports = override(
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#1890ff', // Customize the primary color
        // Add more custom variables here
        '@layout-header-background': '#9db5cc',
        hack: `true; @import "${__dirname}/src/theme.less";`,
      },
    },
  })
);
