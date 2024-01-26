const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) 
{

    for(let currency_code in country_list)
    {

        //Selecting USD by default as FROM currency and NPR as TO currency
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "NPR" ? "selected" : "";
        //Creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;

        //Inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);

    }

    dropList[i].addEventListener("change", e =>{

        //Calling loadFlag with passing target element as an argument
        loadFlag(e.target); 

    });
}

function loadFlag(element)
{
    for(let code in country_list)
    {

        //If currency code of country list is equal to option value
        if(code == element.value)
        { 
            //Selecting img tag of particular drop list
            let imgTag = element.parentElement.querySelector("img"); 
            //Passing country code of a selected currency code in a img url
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }

    }
}

window.addEventListener("load", ()=>{
    
    getExchangeRate();

});

getButton.addEventListener("click", e =>{

    //Preventing form from submitting
    e.preventDefault(); 
    getExchangeRate();

});

const exchangeIcon = document.querySelector("form .icon");

exchangeIcon.addEventListener("click", ()=>{

    //Temporary currency code of FROM drop list
    let tempCode = fromCurrency.value; 

    //Passing TO currency code to FROM currency code
    fromCurrency.value = toCurrency.value; 
    
    //Passing temporary currency code to TO currency code
    toCurrency.value = tempCode; 

    //Calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(fromCurrency);

    //Calling loadFlag with passing select element (toCurrency) of TO 
    loadFlag(toCurrency); 

    //Calling getExchangeRate
    getExchangeRate(); 

})

function getExchangeRate()
{

    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;

    //If user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    if(amountVal == "" || amountVal == "0")
    {
        amount.value = "1";
        amountVal = 1;
    }

    exchangeRateTxt.innerText = "Getting exchange rate...";

    //You will need to create your own credential on ExchangeRate-API
    let url = `https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/${fromCurrency.value}`;

    //Fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result =>{

        //Getting user selected TO currency rate
        let exchangeRate = result.conversion_rates[toCurrency.value]; 

        //Multiplying user entered value with selected TO currency rate
        let totalExRate = (amountVal * exchangeRate).toFixed(2); 

        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        
    }).catch(() =>{ 

        //If user is offline or any other error occured while fetching data then catch function will run
        exchangeRateTxt.innerText = "Something went wrong";
    });

}