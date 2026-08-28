const PAT = "pat_abcdefghijklmnopqrstuvwxyz0123456789";
const api = "http://localhost:3000/api/";

async function fetchApiData(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAT}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: , ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("This error was returned: ", error);
  }
}

function getTax(income) {
  const params = new URLSearchParams();
  params.append("income", income);
  const url = `${api}tax?${params}`;

  return fetchApiData(url);
}

function getHEM(income, dependents) {
  const params = new URLSearchParams();
  params.append("income", income);
  params.append("dependents", dependents);
  const url = `${api}hem?${params}`;

  return fetchApiData(url);
}

//  api call returns: json object
// Calculate Net Monthly Income after tax deductions
async function calculateNetMonthlyIncome(income) {
  const annualTax = await getTax(income);
  return (income - annualTax.tax) / 12;
}

// Determine living expenses (User declared expenses vs HEM baseline, whichever is higher)
async function calculateLivingExpenses(income, dependents, expenses) {
  const baselineHEM = await getHEM(income, dependents);
  return Math.max(expenses, baselineHEM.hem);
}

async function calculateMonthlyRepayment(finInfo) {
  const { income, dependents, expenses, creditLimits } = finInfo;

  const netMonthlyIncome = await calculateNetMonthlyIncome(income);
  const totalLivingExpenses = await calculateLivingExpenses(
    income,
    dependents,
    expenses,
  );
  // Calculate credit card liability (~3% of total limits)
  const creditCardLiability = creditLimits * 0.03;

  return netMonthlyIncome - totalLivingExpenses - creditCardLiability;
}

function calculateMonthlyRate(annualRate) {
  return annualRate / 100 / 12;
}

// Calculate maximum borrowing power using the following formula:
// P = M * (1 - (1 + R)^-N) / R
function calculateMaxLoan(maxRepayment, term, rate) {
  return maxRepayment * ((1 - Math.pow(1 + rate, term * -1)) / rate);
}

module.exports = {
  calculateMonthlyRepayment,
  calculateMonthlyRate,
  calculateMaxLoan,
};
