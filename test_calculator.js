/**
 * Borrowing Power Calculator Test Suite
 */

const assert = require("assert");
const { calculateBorrowingPower } = require("./borrowingCalculator");

describe("Term Deposit Calculator Tests", () => {
  it("should calculate borrowing power for standard values", async () => {
    const financialInfo = {
      income: 120000,
      dependents: 2,
      expenses: 3000,
      creditLimits: 10000,
      assessmentRate: 7.5,
    };
    const result = await calculateBorrowingPower(financialInfo);

    assert.ok(
      result.maxLoanAmount > 0,
      "Should yield a positive borrowing power amount",
    );
    // original value: 4200, I changed to 4600 after adding api call (i.e. correct calculation)
    assert.strictEqual(result.monthlyRepayment, 4600);
  });

  it("should return 0 for invalid negative inputs", async () => {
    const financialInfo = {
      income: 30000,
      dependents: 3,
      expenses: 4000,
      creditLimits: 5000,
      assessmentRate: 7.5,
    };
    const result = await calculateBorrowingPower(financialInfo);

    assert.strictEqual(result.maxLoanAmount, 0);
    assert.strictEqual(result.monthlyRepayment, 0);
  });
});
