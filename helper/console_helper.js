function isInvalidIncome(income) {
  return !Number.isFinite(income) || income < 0;
}

function isInvalidDependents(dependents) {
  return !Number.isFinite(dependents) || dependents < 0;
}

function isInvalidExpenses(expenses) {
  return !Number.isFinite(expenses) || expenses < 0;
}

function isInvalidCreditLimits(creditLimits) {
  return !Number.isFinite(creditLimits) || creditLimits < 0;
}

function printErrorMsgThenClose(rl) {
  console.log("Please enter a positive number.");
  rl.close();
}

module.exports = {
  isInvalidIncome,
  isInvalidDependents,
  isInvalidExpenses,
  isInvalidCreditLimits,
  printErrorMsgThenClose,
};
