export default {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  testPathIgnorePatterns: [
    "/lib/",
    "/node_modules/",
    "^.+\\.data\.ts?$"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/{!(index),}.ts"
  ]
};