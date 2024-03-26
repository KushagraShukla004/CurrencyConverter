const BASE_URL = "https://currency-exchange.p.rapidapi.com";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "070da45082msha2ec2c68db20b69p1d0f69jsnc6bbd86299d3",
    "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
  },
};

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".currSelect .from");
const toCurr = document.querySelector(".currSelect .to");
const result = document.querySelector(".result p");
const swapCurrbtn = document.querySelector(".swapCurr");

for (let select of dropdowns) {
  if (select.name === "from") {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = countryNameList[currCode];
      newOption.value = currCode;
      if (currCode === "USD") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }
  } else if (select.name === "to") {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = countryNameList[currCode];
      newOption.value = currCode;
      if (currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }
  }
}

// Add event listener to each dropdown
dropdowns.forEach((select) => {
  select.addEventListener("change", (event) => {
    //for updating flag
    updateFlag(event.target);
  });
});

const updateFlag = (el) => {
  let currCode = el.value; //INR
  let countryCode = countryList[currCode]; //IN
  let newFlag = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = el.parentElement.querySelector("img");
  img.src = newFlag;
};

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let amount = document.querySelector(".amount .input");
  let amtVal = amount.value;
  //if there is any non-numeric character then replace them with "" that mean remove them and only keep numeric and "." value
  let numericValue = parseFloat(amtVal.replace(/[^\d.]/g, ""));

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  //check whether amtVal contains anything other than numeric value or "." if true then change it with clean numericValue with no non-numeric characters
  if (/[^0-9.]/.test(amtVal)) {
    amtVal = numericValue;
    amount.value = `${numericValue}`;
  }
  const URL = `${BASE_URL}/exchange?from=${fromCurr.value}&to=${toCurr.value}&q=1.0`;
  const response = await fetch(URL, options);
  const data = await response.json();
  let finalAmt = amtVal * data;

  // Darken the four decimal places in the result
  let parts = finalAmt.toFixed(4).split("."); //83.417350 = ["83","417350" ]
  let darkenedResult = `${parts[0]}.${parts[1].replace(
    /\d{2}$/,
    '<span class="darkened">$&</span>'
  )}`;
  // 83.41<span class="darkened">7350</span>

  result.innerHTML = `${amtVal} ${fromCurr.value} = ${darkenedResult} ${toCurr.value}`;
});

swapCurrbtn.addEventListener("click", (e) => {
  e.preventDefault();
  let tempFromCurr = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempFromCurr;

  updateFlag(fromCurr);
  updateFlag(toCurr);
});
