/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ["node_modules", "src"],

    // A preset that is used as a base for Jest's configuration
    preset: "ts-jest",

    // A list of paths to directories that Jest should use to search for files in
    roots: ["src"],

    // The test environment that will be used for testing
    testEnvironment: "node",

    // A map from regular expressions to paths to transformers
    // transform: undefined,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },

    // Indicates whether each individual test should be reported during the run
    verbose: true,
};
