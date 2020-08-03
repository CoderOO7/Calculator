//Global Variables
const calculate = {num1:'', num2:'', operator:'', result: ''};
let isOperatorPressedOnce = false;

//Selecting DOM Nodes
const buttonContainer = document.getElementById('button-container');
const mediumDisplay = document.getElementById('medium');
const smallDisplay = document.getElementById('small');

buttonContainer.addEventListener('click',activateButtons);

function activateButtons(e){
    if(e.target.className.includes('misc__btn')){
        if(e.target.dataset.op.includes('result')){
            return operate(calculate);
        }
        if(e.target.dataset.op.includes('reset')){
            return resetCalculator();
        }
        if(e.target.dataset.op.includes('backspace')){
            return clearInput();
        }
    }

    if(e.target.className.includes('operator')){
        if(!isOperatorPressedOnce)
            isOperatorPressedOnce = true;
        else{
            calculate.num1 = calculate.result;
            calculate.num2 = '';
        }

        calculate.operator = e.target.dataset.op;
        fillSmallDisplay(e.target.textContent);
    }

    if(e.target.className.includes('number')){
        if(isOperatorPressedOnce && calculate.num1 !== ''){
            calculate.num2 += e.target.textContent;
            operate(calculate);
        }
        else
            calculate.num1 += e.target.textContent;

        fillSmallDisplay(e.target.textContent);
    }
}

const fillSmallDisplay = (string) => smallDisplay.textContent += string;

const fillMediumDisplay = (string) => mediumDisplay.textContent = string;

const add = (num1,num2) => num1 + num2;

const substract = (num1,num2) => num1 - num2;

const multiply = (num1,num2) => num1 * num2;

const divide = (num1,num2) => num1 / num2;

const percentage = (num1,num2) => num2 !== '' ? (num1/100)*num2 : num1/100;

const operate = ({num1,num2,operator}) => {
    console.log({num1,num2,operator});
    
    let result = null;
    num1 = Number(num1);
    num2 = Number(num2);

    if(operator === "plus")
        result = add(num1,num2);
    else if(operator === "minus")
        result = substract(num1,num2);
    else if(operator === "multiply")
        result = multiply(num1,num2);
    else if(operator === "divide")
        result = divide(num1,num2);
    else if(operator == "percentage")
        result = percentage(num1,num2);

    calculate.result = result.toString();
    fillMediumDisplay(result);
    console.log({result});
}

const clearInput = () => {
    console.log('clearInput');
    const string =  smallDisplay.textContent;
    smallDisplay.textContent = string.slice(0,string.length-1);
}

const resetCalculator = () => {
    for(const key in calculate){
        calculate[key] = '';
    }
    isOperatorPressedOnce = false;
    smallDisplay.textContent = '';
    mediumDisplay.textContent = '';
}