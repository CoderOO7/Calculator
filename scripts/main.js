//Global Variables
const calculate = {num1:'', num2:'', operator:''};

//Selecting DOM Nodes
const buttonContainer = document.getElementById('button-container');
const mediumDisplay = document.getElementById('medium');
const smallDisplay = document.getElementById('small');

buttonContainer.addEventListener('click',activateButtons);

function activateButtons(e){
    if(e.target.className.includes('operator')){
        if(e.target.dataset.op.includes('result')){
            return operate(calculate);
        }
        calculate.operator = e.target.dataset.op;
        fillSmallDisplay(e.target.textContent);
    }
    if(e.target.className.includes('number')){
        if(calculate.num1 !== '')
            calculate.num2 += e.target.textContent;
        else
            calculate.num1 += e.target.textContent;

        fillSmallDisplay(e.target.textContent);
    }
}

function fillSmallDisplay(string){
    console.log(string);
    smallDisplay.textContent += string;
}

function fillMediumDisplay(string){
    console.log(string);
    mediumDisplay.textContent = string;
}

const add = (num1,num2) => {
    return num1 + num2;
}

const substract = (num1,num2) => {
    return num1 - num2;
}

const multiply = (num1,num2) => {
    return num1 * num2;
}

const divide = (num1,num2) => {
    return num1 / num2;
}

const operate = ({num1,num2,operator}) => {
    console.log({calculate});
    console.log(operator);
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

    fillMediumDisplay(result);
    console.log({result});
}