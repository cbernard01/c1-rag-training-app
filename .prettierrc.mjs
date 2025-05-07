/** @type {import("prettier").Config} */

const config = {
  semi: true,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 180,
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  quoteProps: "consistent",
  arrowParens: "avoid",
  bracketSameLine: false,
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  proseWrap: "always",
  requirePragma: false,
  useTabs: false,
  plugins: ["prettier-plugin-tailwindcss"],
  endOfLine: "auto",
  overrides: [
    {
      files: "*.{js,jsx,ts,tsx}",
      options: {
        parser: "typescript",
      },
    },
  ],
};

export default config;
