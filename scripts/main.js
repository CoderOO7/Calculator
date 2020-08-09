//Global Variables
const calculate = { num1: '', num2: '', operator: '', result: '' };
let isOperatorPressedOnce = false;

//Selecting DOM Nodes
const buttonContainer = document.getElementById('button-container');
const mediumDisplay = document.getElementById('medium');
const smallDisplay = document.getElementById('small');

buttonContainer.addEventListener('click', activateButtons);
buttonContainer.addEventListener('transitionend', removeTransition);

function activateButtons(e) {
    if(e.target.parentElement.id.includes("button-container"))
        e.target.classList.add("clicked");

    if (e.target.className.includes('misc__btn')) {
        if (e.target.dataset.operator.includes('result')) {
            return operate(calculate);
        }
        if (e.target.dataset.operator.includes('reset')) {
            return resetCalculator();
        }
        if (e.target.dataset.operator.includes('backspace')) {
            return clearInput();
        }
    }

    if (e.target.className.includes('operator')) {
        if (!isOperatorPressedOnce)
            isOperatorPressedOnce = true;
        else {
            calculate.num1 = calculate.result;
            calculate.num2 = '';
        }

        calculate.operator = e.target.dataset.operator;
        fillSmallDisplay(e.target.textContent);
    }

    if (e.target.className.includes('number')) {
        if (isOperatorPressedOnce && calculate.num1 !== '') {
            calculate.num2 += e.target.textContent;
            operate(calculate);
        }
        else
            calculate.num1 += e.target.textContent;

        fillSmallDisplay(e.target.textContent);
    }
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('clicked');
}

const fillSmallDisplay = (string) => {
    if(getInputTextWidth(smallDisplay) < getContentWidth(smallDisplay))
        smallDisplay.textContent += string
    else{
        let newStr = smallDisplay.textContent+string;
        smallDisplay.textContent = newStr.slice(1, newStr.length - 1);
    }
}

const fillMediumDisplay = (string) => { 
    if(getInputTextWidth(mediumDisplay) < getContentWidth(mediumDisplay))
        mediumDisplay.textContent = string;
    else{
        let newStr = mediumDisplay.textContent+string;
        mediumDisplay.textContent = mewStr.slice(1, newStr.length - 1);
    }
}

const add = (num1, num2) => num1 + num2;

const substract = (num1, num2) => num1 - num2;

const multiply = (num1, num2) => num1 * num2;

const divide = (num1, num2) => num2 === 0 ? "GET OUT !!" : num1 / num2;

const percentage = (num1, num2) => num2 !== '' ? (num1 / 100) * num2 : num1 / 100;

const operate = ({ num1, num2, operator }) => {
    let result = null;
    num1 = Number(num1);
    num2 = Number(num2);

    if (operator === "+")
        result = add(num1, num2);
    else if (operator === "-")
        result = substract(num1, num2);
    else if (operator === "x")
        result = multiply(num1, num2);
    else if (operator === "÷")
        result = divide(num1, num2);
    else if (operator === "%")
        result = percentage(num1, num2);

    calculate.result = filterResult(result);
    fillMediumDisplay(calculate.result);
    console.log({ calculate })
}

const filterResult = (result) => {
    return Number.isNaN(Number(result)) ? result : result % 1 != 0 ? result.toFixed(2) : result.toString();
}


const clearInput = () => {
    console.log('clearInput');
    const string = smallDisplay.textContent;
    smallDisplay.textContent = string.slice(0, string.length - 1);
}

const resetCalculator = () => {
    for (const key in calculate) {
        calculate[key] = '';
    }
    isOperatorPressedOnce = false;
    smallDisplay.textContent = '';
    mediumDisplay.textContent = '';
}

const getContentWidth = (element) => {
    let styles = window.getComputedStyle(element);
  
    return element.clientWidth
      - parseFloat(styles.paddingLeft)
      - parseFloat(styles.paddingRight)
}

const getInputTextWidth = (element) => {
    let c = document.createElement("canvas");
    let ctx = c.getContext("2d");
    let txtWidth = ctx.measureText(element.textContent).width;
    return txtWidth;
}

document.addEventListener('keydown', e => {
    console.log(e.key);
    if (e.key === '.' || e.key >= 0 && e.key <= 9) {
        document.querySelector(`button[data-number='${e.key}']`).click();
    }
    else if (e.key === "+") {
        document.querySelector(`button[data-operator='${e.key}']`).click();
    }
    else if (e.key === "-") {
        document.querySelector(`button[data-operator='${e.key}']`).click();
    }
    else if (e.key === "*") {
        document.querySelector(`button[data-operator='x']`).click();
    }
    else if (e.key === "/") {
        document.querySelector(`button[data-operator='÷']`).click();
    }
    else if (e.key === "%") {
        document.querySelector(`button[data-operator='${e.key}']`).click();
    }
    else if (e.key === "Backspace") {
        document.querySelector(`button[data-operator='backspace']`).click();
    }
    else if (e.key === "Escape" || e.key === "Delete") {
        document.querySelector(`button[data-operator='reset']`).click();
    }
    else if (e.key === "Enter") {
        document.querySelector(`button[data-operator='=']`).click();
    }
})