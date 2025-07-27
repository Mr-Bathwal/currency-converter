document.addEventListener("DOMContentLoaded", () => {
  const fromCurrency = document.getElementById("fromCurrency");
  const toCurrency = document.getElementById("toCurrency");
  const searchFrom = document.getElementById("searchFrom");
  const searchTo = document.getElementById("searchTo");
  const convertBtn = document.getElementById("convertBtn");
  const amountInput = document.getElementById("amount");
  const resultDiv = document.getElementById("result");
  const swapBtn = document.getElementById("swapBtn");

  let currenciesData = {};
  let baseRates = {};

  async function fetchRates(base = "USD") {
    const res = await fetch(`/api/rates?base=${base}`);
    const data = await res.json();
    baseRates = data.rates;
    return data;
  }

  function populateDropdowns() {
    const codes = Object.keys(baseRates).sort();
    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";
    codes.forEach(code => {
      const optionText = `${code} - ${getCountryName(code)}`;
      const opt1 = document.createElement("option");
      opt1.value = code;
      opt1.textContent = optionText;

      const opt2 = opt1.cloneNode(true);

      fromCurrency.appendChild(opt1);
      toCurrency.appendChild(opt2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
  }

  function getCountryName(code) {
    const map = {
      USD: "United States Dollar",
      INR: "Indian Rupee",
      EUR: "Euro",
      GBP: "British Pound",
      JPY: "Japanese Yen",
      AUD: "Australian Dollar",
      CAD: "Canadian Dollar",
      CNY: "Chinese Yuan",
      // Add more as needed
    };
    return map[code] || "Currency";
  }

  function filterDropdown(input, dropdown) {
    const filter = input.value.toUpperCase();
    Array.from(dropdown.options).forEach(opt => {
      const txt = opt.textContent.toUpperCase();
      opt.style.display = txt.includes(filter) ? "" : "none";
    });
  }

    convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    try {
      // Fetch rates for the selected "from" currency
      const data = await fetchRates(from);

      if (!data.rates[to]) {
        resultDiv.textContent = "Invalid currency selection.";
        return;
      }

      const rate = data.rates[to];
      const result = (amount * rate).toFixed(2);
      resultDiv.textContent = `${amount} ${from} = ${result} ${to}`;
    } catch (error) {
      resultDiv.textContent = "Error fetching conversion rates.";
    }
  });


  searchFrom.addEventListener("input", () => filterDropdown(searchFrom, fromCurrency));
  searchTo.addEventListener("input", () => filterDropdown(searchTo, toCurrency));

  swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
  });

  // Initialize
  fetchRates("USD").then(() => populateDropdowns());
});
