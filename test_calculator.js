/**
 * Borrowing Power Calculator Test Suite
 */

const assert = require("assert");
const { calculateStandardLoan } = require("./borrowingCalculator");
const {
  isInvalidIncome,
  isInvalidDependents,
  isInvalidExpenses,
  isInvalidCreditLimits,
} = require("./helper/console_helper");

describe("Term Deposit Calculator Tests", () => {
  it("should calculate borrowing power for standard values", async () => {
    const financialInfo = {
      income: 120000,
      dependents: 2,
      expenses: 3000,
      creditLimits: 10000,
      assessmentRate: 7.5,
    };
    const result = await calculateStandardLoan(financialInfo);

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
    const result = await calculateStandardLoan(financialInfo);

    assert.strictEqual(result.maxLoanAmount, 0);
    assert.strictEqual(result.monthlyRepayment, 0);
  });
});

describe("User input validation tests", () => {
  it("should return true for non-numerical income", () => {
    const incomeStr = "abcde";
    assert.strictEqual(isInvalidIncome(incomeStr), true);
  });
  it("should return true for negative income number", () => {
    const negativeIncome = -100000;
    assert.strictEqual(isInvalidIncome(negativeIncome), true);
  });

  it("should return true for non-numerical dependent value", () => {
    const dependentsStr = "son and daughter";
    assert.strictEqual(isInvalidDependents(dependentsStr), true);
  });
  it("should return true for negative dependent value", () => {
    const negativeDependents = -10;
    assert.strictEqual(isInvalidDependents(negativeDependents), true);
  });

  it("should return true for non-numerical expense value", () => {
    const expensesStr = "expenses";
    assert.strictEqual(isInvalidExpenses(expensesStr), true);
  });
  it("should return true for negative expense value", () => {
    const negativeExpenses = -2000;
    assert.strictEqual(isInvalidExpenses(negativeExpenses), true);
  });

  it("should return true for non-numerical credit limits", () => {
    const creditLimitsStr = "credit limits";
    assert.strictEqual(isInvalidCreditLimits(creditLimitsStr), true);
  });
  it("should return true for negative credit limits", () => {
    const negativeCreditLimits = -10000;
    assert.strictEqual(isInvalidCreditLimits(negativeCreditLimits), true);
  });
});
