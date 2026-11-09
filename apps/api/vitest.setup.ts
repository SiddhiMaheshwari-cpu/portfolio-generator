if (process.env.TEST_DB !== "true") {
  throw new Error("Refusing to run tests: .env.test was not loaded");
}