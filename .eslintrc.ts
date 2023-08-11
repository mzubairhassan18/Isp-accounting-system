module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "import"],
  rules: {
    // Add or adjust rules here as needed
    // For example, you can turn off rules that conflict with TypeScript
    "react/prop-types": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      { tsx: "never", ts: "never" },
    ],
    "import/no-unresolved": "error",
    "import/prefer-default-export": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
};

