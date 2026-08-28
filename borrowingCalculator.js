const {
  calculateMonthlyRepayment,
  calculateMonthlyRate,
  calculateMaxLoan,
} = require("./helper/calc_helper");
const {
  isInvalidIncome,
  isInvalidDependents,
  isInvalidExpenses,
  isInvalidCreditLimits,
  printErrorMsgThenClose,
} = require("./helper/console_helper");

/**
 * Borrowing Power Calculator
 *
 * Gen's incomplete prototype.
 * This currently calculates what a user can borrow over 30 years.
 * Currently this code uses placeholder methods for Tax and HEM values.
 *
 * TODO: Refactor the code to pull Tax and HEM values from an API call.
 * A server.js has been provided to supply these values.
 */

// Global constant for mortgage simulation
const LOAN_TERM_MONTHS = 360; // 30 Years
const INTEREST_RATE = 7.0; // 7.0% baseline interest rate
const ASSESSMENT_RATE_BUFFER = 3.0; // 3.0% buffer added to interest rates

/**
 * Calculates the total borrowing power amount and the monthly repayment configuration
 */
async function calculateStandardLoan(financialInfo) {
  const maxMonthlyRepayment = await calculateMonthlyRepayment(financialInfo);

  // Return early if user cannot afford a loan at all
  if (maxMonthlyRepayment <= 0) {
    return { maxLoanAmount: 0, monthlyRepayment: 0 };
  }

  const monthlyRate = calculateMonthlyRate(financialInfo.assessmentRate);

  const maxLoanAmount = calculateMaxLoan(
    maxMonthlyRepayment,
    LOAN_TERM_MONTHS,
    monthlyRate,
  );

  return {
    maxLoanAmount: Number(maxLoanAmount.toFixed(2)),
    monthlyRepayment: Number(maxMonthlyRepayment.toFixed(2)),
  };
}

// Select loan type
function calculateBorrowingPower(type) {
  switch (type) {
    case "standard":
      return calculateStandardLoan;
    default:
      console.log("We don't have that type of loan. Please try again.");
  }
}

function runConsoleMode() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Mortgage Borrowing Power Calculator");
  console.log("===================================");

  rl.question("Gross Annual Income: $", (income) => {
    const parsedIncome = parseFloat(income);
    if (isInvalidIncome(parsedIncome)) {
      printErrorMsgThenClose(rl);
      return;
    }

    rl.question("Number of Dependents: ", (dependents) => {
      const parsedDependents = parseInt(dependents);
      if (isInvalidDependents(parsedDependents)) {
        printErrorMsgThenClose(rl);
        return;
      }

      rl.question("Declared Monthly Expenses: $", (expenses) => {
        const parsedExpenses = parseFloat(expenses);
        if (isInvalidExpenses(parsedExpenses)) {
          printErrorMsgThenClose(rl);
          return;
        }

        rl.question("Total Credit Card Limits: $", async (creditLimits) => {
          const parsedCreditLimits = parseFloat(creditLimits);
          if (isInvalidCreditLimits(parsedCreditLimits)) {
            printErrorMsgThenClose(rl);
            return;
          }
          // Banks assess loans using base rate + buffer for safety
          const assessmentRate = INTEREST_RATE + ASSESSMENT_RATE_BUFFER;

          const financialInfo = {
            income: parsedIncome,
            dependents: parsedDependents,
            expenses: parsedExpenses,
            creditLimits: parsedCreditLimits,
            assessmentRate,
          };

          // For future enhancement: Loan type selection
          const loanType = "standard";

          // Holds loan calculation function of selected loan type
          const selectLoanType = calculateBorrowingPower(loanType);

          const result = await selectLoanType(financialInfo);

          console.log("\n--- Calculation Summary ---");
          console.log(
            `Maximum Borrowing Power at ${INTEREST_RATE}%: $${result.maxLoanAmount.toLocaleString()}`,
          );
          console.log(
            `Assumed Monthly Mortgage Repayment: $${result.monthlyRepayment.toLocaleString()} over 30 years`,
          );

          rl.close();
        });
      });
    });
  });
}

if (require.main === module) {
  runConsoleMode();
}

module.exports = { calculateStandardLoan };
