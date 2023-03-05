const inputSlider = document.querySelector("[passwordSlider]");
const lengthDisplay = document.querySelector("[password-Length]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[copybutton]");
const copyMessage = document.querySelector("[data-copyMssg]");
const upperCaseCheck = document.querySelector("#Uppercase");
const lowerCaseCheck = document.querySelector("#Lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[strengthCircle]");
const generateBtn = document.querySelector("[generatePassword-Button]");
const refresh = document.querySelector("refreshpage")
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*(){}[]+=-/?><'

let password = "";
let pwdlength = 5;
let checkCount = 0;
indicatorColor("#ccc");
sliderFun();

function sliderFun()
{
    inputSlider.value = pwdlength;
    lengthDisplay.innerText = pwdlength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (pwdlength - min)*100/(max - min)) + "% 100%";
}

inputSlider.addEventListener('input', (e) => {
    pwdlength = e.target.value;
    sliderFun();
})

// set indicator color
function indicatorColor(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function strength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNumbers = false;
    let hasSymbols = false;
    
    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumbers = true;
    if(symbolsCheck.checked) hasSymbols = true;

    if( hasUpper && hasLower && hasNumbers && hasSymbols)
    {
        indicatorColor('green');
    }
    else if( hasLower && hasUpper )
    {
        indicatorColor('orange');
    }
    else
    {
        indicatorColor('red');
    }
}

function randInt( min , max )
{
    return Math.floor((Math.random()* (max-min)) + min);
}

function ranNumbers()
{
    return randInt(0,10);
}

function ranUpperCase()
{
    return String.fromCharCode(randInt(65,91));
}
function ranLowerCase()
{
    return String.fromCharCode(randInt(97,123));
}
function ranSymbols()
{
    const ranNum = randInt(0,symbols.length);
    return symbols.charAt(ranNum);
}

async function copiedText()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText='Copied';
    }
    catch(e)
    {
        copyMessage.innerText="Failed";
    }

    // settime out functioni for copied text 
    copyMessage.classList.add("active");
    setTimeout(()=>
    {
        copyMessage.classList.remove('active');
    },1000)
}

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copiedText();
    }
})


function handelCheckBoxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>
    {
        if(checkbox.checked)
        {
            checkCount++;
        }
    })
    // special condition
    if(pwdlength < checkCount)
    {
        pwdlength = checkCount;
        sliderFun();
    }
}

allCheckBox.forEach((checkbox)=>
{
    checkbox.addEventListener('change',handelCheckBoxChange);
}) 

function sufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click',()=>{
    // none of the check box are selected
    if(checkCount<=0){
        return;
    }

    if( pwdlength < checkCount )
    {
        pwdlength = checkCount;
        sliderFun();
    }

    // begin journey to find the new password
    // remove old password
    password="";

    // checkbox ko tick hai un ko compulsary daal denge
    // if(upperCaseCheck.checked)
    // {
    //     password += ranUpperCase();
    // }

    // if(lowerCaseCheck.checked)
    // {
    //     password += ranLowerCase();
    // }

    // if(symbolsCheck.checked)
    // {
    //     password += ranSymbols();
    // }
    // if(numbersCheck.checked)
    // {
    //     password+=ranNumbers();
    // }

    let funArr = [];
    if(upperCaseCheck.checked)
    {
        funArr.push(ranUpperCase);
    }

    if(lowerCaseCheck.checked)
    {
        funArr.push(ranLowerCase);
    }

    if(symbolsCheck.checked)
    {
        funArr.push(ranSymbols);
    }

    if(numbersCheck.checked)
    {
        funArr.push(ranNumbers);
    }  

    // compulsary addition
    for( let i=0; i<funArr.length ; i++ )
    {
        password = password+funArr[i]();
    }

    // remaining addition
    for(let i=0 ; i<pwdlength-funArr.length ; i++)
    {
        let ranIndex = randInt(0,funArr.length);
        password = password + funArr[ranIndex](); 
    }

    // suffel password
    password = sufflePassword(Array.from(password));

    // show in input
    passwordDisplay.value = password;
    // calculate streangth
    strength();

})

// refresh.addEventListener('click' , function refreshPage() {
//     window.location.reload();

// })

function refreshPage(){
    window.location.reload();
}