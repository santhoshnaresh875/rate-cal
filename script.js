//use strict mode the script file
'use strict';


//the promise will also for reusability
// Define a function to fetch currency data using a Promise
function fetchCurrencyData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          reject(
            new Error(
              `Failed to fetch data (${response.status} ${response.statusText})`
            )
          );
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// we can use different api also
let url = "https://api.frankfurter.app/currencies";
// Now, initiate the data retrieval and setup the event listener
async function fetchDataAndSetup() {
  try {
    const currencyData = await fetchCurrencyData(url); // calling promise
    populateCurrencySelect(currencyData); //resolve calling populate function

    const button = document.getElementById("button");
    //click the convert button the handle conversion must be called
    button.addEventListener("click", handleConversion);
  } catch (error) {
    //catch the promise reject
    console.log("An error occurred while fetching currency data:", error);
  }
}

fetchDataAndSetup();

// Function to populate the currency select options
function populateCurrencySelect(data) {
  const select_box = document.querySelectorAll(".currency");
  data = Object.entries(data);
    for (let i of data) {
      let option_list = `<option value="${i[0]}">${i[0]}</option>`;
      // console.log(option_list);
      select_box[0].innerHTML += option_list;
      select_box[1].innerHTML += option_list;
    }
}

// Function to handle the conversion
function handleConversion() {
  const selectBoxes = document.querySelectorAll(".currency");
  const currency1 = selectBoxes[0].value;
  const currency2 = selectBoxes[1].value;
  const input = document.getElementById("input").value;

  if (input === '') {
    // Handle the case where the input is empty.
    document.getElementById('input').style.border = '2px solid red'
    document.getElementById("alert-box").innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
      Input is empty.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  } else if (currency1=== ''|| currency2 ==='') {
    // Handle the case where the selected currencies are empty
    document.getElementById("alert-box").innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
      Oops! You not select the currecncy
      <button type of="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  }else if (currency1 === currency2) {
    // Handle the case where the selected currencies are the same.
    document.getElementById("alert-box").innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
      Oops! You have selected the same currency.
      <button type of="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  } else {
    
    document.getElementById('input').style.border = '1px solid white'
    // Input is not empty and currencies are different, proceed with conversion
    fetchConversionRate(currency1, currency2, parseFloat(input));
  }
}

function fetchConversionRate(currency1,currency2,input) {
  // again call the api for the currency conversion
  fetch(
    `https://api.frankfurter.app/latest?amount=${input}&from=${currency1}&to=${currency2}`
  )
    .then((response) => {
      // if the respose failure thorw a error
      if (!response.ok) {
        throw new Error(
          `Failed to fetch conversion data (${response.status} ${response.statusText})`
        );
      }
      return response.json();
    })
    .then((data) => {
      // if response successfull result will be show
      const result = Object.values(data.rates)[0];
      document.getElementById("alert-box").innerHTML = "";
      document.getElementById("result").value = result.toFixed(4);
    })
    .catch((error) => {
      // catch the failure response
      console.log("An error occurred:", error);
    });
}