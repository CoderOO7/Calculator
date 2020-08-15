//Global Variables
"use-strict";
let calculate = {
  num1: "",
  num2: "",
  operator: "",
  result: "",
};
let inputCharStack = [];
let resultStack = [];

//Selecting DOM Nodes
const buttonContainer = document.querySelector(".container");
const resultDisplay = document.querySelector(".display__result");
const inputDisplay = document.querySelector(".display__input");

buttonContainer.addEventListener("click", activateButtons);
buttonContainer.addEventListener("transitionend", removeTransition);

function activateButtons(e) {
  if (e.target.parentElement.className.includes("container"))
    e.target.classList.add("clicked");

  if (e.target.className.includes("calc-btn--action")) {
    handleActionClick(e);
  }

  if (e.target.className.includes("calc-btn--operator")) {
    handleOperatorClick(e);
  }

  if (e.target.className.includes("calc-btn--number")) {
    handleNumberClick(e);
  }

  if (e.target.className.includes("calc-btn--decimal")) {
    handleDecimalClick(e);
  }
}

const handleActionClick = (e) => {
  if (e.target.dataset.action.includes("result")) {
    if (!isEmpty(calculate.num1) && !calculate.num2) {
      return operate(calculate);
    }
  }
  if (e.target.dataset.action.includes("reset")) {
    return resetCalculator();
  }
  if (e.target.dataset.action.includes("undo")) {
    return clearInput();
  }
};

const handleOperatorClick = (e) => {
  if (isEmpty(calculate.num1)) return;
  if (!isEmpty(calculate.result)) {
    calculate.num1 = calculate.result;
    calculate.num2 = "";
  }
  calculate.operator = e.target.dataset.operator;
  inputCharStack.push(e.target.dataset.operator);
  fillinputDisplay(e.target.dataset.operator);
};

const handleNumberClick = (e) => {
  if (isEmpty(calculate.operator)) {
    calculate.num1 += e.target.dataset.number;
  } else {
    calculate.num2 += e.target.dataset.number;
    operate(calculate);
  }
  inputCharStack.push(e.target.dataset.number);
  fillinputDisplay(e.target.dataset.number);
};

const handleDecimalClick = (e) => {
  if (isEmpty(calculate.num1)) return;
  if (isEmpty(calculate.operator)) {
    if (!calculate.num1.includes(".")) {
      calculate.num1 += ".";
      fillinputDisplay(e.target.dataset.decimal);
    }
  } else {
    if (!calculate.num2.includes(".")) {
      calculate.num2 += ".";
      fillinputDisplay(e.target.dataset.decimal);
    }
  }
};

const replaceOperator = (inputString, newOperator) => {
  let currOperatorIdx = inputString.length - 1;
  return inputString.slice(0, currOperatorIdx) + newOperator;
};

const isDecimal = (inputChar) => inputChar === ".";

const isOperator = (inputChar) => {
  return ["+", "-", "x", "%", "÷"].some((item) => item === inputChar);
};

const isEmpty = (str) => !str || str.length === 0;

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("clicked");
}

const fillinputDisplay = (inputChar) => {
  let inputString = inputDisplay.textContent;
  let lastChar = inputString[inputString.length - 1];

  if (isOperator(inputChar) && isOperator(lastChar)) {
    let length = inputDisplay.textContent.length;
    inputString = inputString.slice(0, length - 1);
    inputDisplay.textContent = inputString;
    inputCharStack.splice(inputCharStack.length - 2, 1);
  }

  if (inputString.length < 16) {
    inputDisplay.textContent += inputChar;
  } else {
    inputDisplay.textContent = inputString.slice(1) + inputChar;
  }
};

const fillresultDisplay = (finalAnswer) => {
  let maxDigit = 13;
  let prevAnswer = Number(resultDisplay.textContent).toString();
  let isPrevAnsExponential = prevAnswer.match(/\d+[.]?\d+[eE][+]\d+/);
  if (
    Number.isNaN(Number(finalAnswer)) ||
    (!isPrevAnsExponential && prevAnswer.length <= maxDigit)
  )
    resultDisplay.textContent = finalAnswer;
  else {
    resultDisplay.textContent = roundResult(finalAnswer, maxDigit);
  }
};

const add = (num1, num2) => num1 + num2;

const substract = (num1, num2) => num1 - num2;

const multiply = (num1, num2) => num1 * num2;

const divide = (num1, num2) => (num2 === 0 ? "GET OUT !!" : num1 / num2);

const percentage = (num1, num2) =>
  num2 !== "" ? (num1 / 100) * num2 : num1 / 100;

const operate = ({ num1, num2, operator }) => {
  let result = null;
  num1 = Number(num1);
  num2 = Number(num2);

  if (operator === "+") result = add(num1, num2);
  else if (operator === "-") result = substract(num1, num2);
  else if (operator === "x") result = multiply(num1, num2);
  else if (operator === "÷") result = divide(num1, num2);
  else if (operator === "%") result = percentage(num1, num2);

  calculate.result = filterResult(result);
  fillresultDisplay(calculate.result);
  resultStack.push({ ...calculate });
  console.log({
    resultStack,
  });
};

const roundResult = (answer, maxDigit) => {
  let decimalIdx = answer.indexOf(".");
  /* return decimalIdx >= 0
    ? Number.parseFloat(answer).toFixed(maxDigit - decimalIdx)
    : Number.parseFloat(answer).toExponential(); */
  return Number.parseFloat(answer).toExponential(2);
};

const filterResult = (result) => {
  return Number.isNaN(Number(result))
    ? result
    : result % 1 != 0
    ? result.toFixed(2)
    : result.toString();
};

const clearInput = () => {
  let inputCharStackString = inputCharStack.join("");

  if (inputCharStackString.length) {
    let inputString = "";
    let lastInputChar = "";
    let endIdx = inputCharStackString.length;
    let startIdx = endIdx - inputDisplay.textContent.trim().length;

    inputString = inputCharStackString.slice(startIdx, endIdx);
    lastInputChar = inputString[inputString.length - 1];

    if (!Number.isNaN(Number(lastInputChar))) {
      resultStack.pop();
      if (isEmpty(resultStack)) {
        resultDisplay.textContent = "";
      } else {
        calculate = { ...resultStack[resultStack.length - 1] };
        calculate.num1 = calculate.result;
        calculate.num2 = "";
        resultDisplay.textContent = resultStack[resultStack.length - 1].result;
      }
    }
    inputCharStack.pop();
    if (startIdx - 1 >= 0) {
      inputDisplay.textContent = inputCharStackString.slice(
        startIdx - 1,
        inputCharStackString.length - 1
      );
    } else {
      inputDisplay.textContent = inputCharStackString.slice(
        startIdx,
        inputCharStackString.length - 1
      );
    }
  } else {
    resetCalculator();
  }
};

const resetCalculator = () => {
  for (const key in calculate) {
    calculate[key] = "";
  }
  inputDisplay.textContent = "";
  resultDisplay.textContent = "";
  resultStack = [];
  inputCharStack = [];
};

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key >= 0 && e.key <= 9) {
    document.querySelector(`button[data-number='${e.key}']`).click();
  } else if (e.key === ".") {
    document.querySelector(`button[data-decimal='${e.key}']`).click();
  } else if (e.key === "+") {
    document.querySelector(`button[data-operator='${e.key}']`).click();
  } else if (e.key === "-") {
    document.querySelector(`button[data-operator='${e.key}']`).click();
  } else if (e.key === "*") {
    document.querySelector(`button[data-operator='x']`).click();
  } else if (e.key === "/") {
    document.querySelector(`button[data-operator='÷']`).click();
  } else if (e.key === "%") {
    document.querySelector(`button[data-operator='${e.key}']`).click();
  } else if (e.key === "Backspace") {
    document.querySelector(`button[data-action='undo']`).click();
  } else if (e.key === "Escape" || e.key === "Delete") {
    document.querySelector(`button[data-action='reset']`).click();
  } else if (e.key === "Enter") {
    document.querySelector(`button[data-operator='=']`).click();
  }
});
