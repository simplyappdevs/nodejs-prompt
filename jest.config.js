export default {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  testPathIgnorePatterns: [
    "/lib/",
    "/node_modules/",
    "/src/examples/",
    "^.+\\.data\.ts?$"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
};