// Base API URL for fetching currency exchange rates
const base_url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Select key elements from the HTML
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Loop through both dropdowns and populate them with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option"); 
    newOption.innerText = currCode; 
    newOption.value = currCode; // Set option value as currency code
    
    // Set default selected currency (INR for 'from', USD for 'to')
    if (select.name === "from" && currCode === "INR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "USD") {
      newOption.selected = "selected";
    }

    select.append(newOption); // Add option to the dropdown
  }

  // When currency changes, update the flag image
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target); // Call flag update function
  });
}

// Fetch and display exchange rate based on selected currencies and amount
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input"); // Get input value
  let amtVal = amount.value; 

  // Set default amount to 1 if input is invalid
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Build API URL for the selected 'from' currency
  const URL = `${base_url}/${fromCurr.value.toLowerCase()}.json`;

  // Fetch exchange rate data from the API
  let response = await fetch(URL);
  let data = await response.json();

  // Get the exchange rate between 'from' and 'to' currencies
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
  let finalAmount = amtVal * rate; // Calculate converted amount

  // Display the exchange result in the message
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

// Update flag image when the currency is changed
const updateFlag = (element) => {
  let currCode = element.value; // Get selected currency code
  let countryCode = countryList[currCode]; // Get country code for the flag URL
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // Build flag URL
  let img = element.parentElement.querySelector("img"); // Find the flag image element
  img.src = newSrc; // Update the flag image source
};

// When the button is clicked, fetch and show the exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form from reloading
  updateExchangeRate(); // Call function to update exchange rate
});

// Update exchange rate when the page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
