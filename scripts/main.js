//Global Variables
const calculate = {
  num1: "",
  num2: "",
  operator: "",
  result: "",
};
let isOperatorPressedOnce = false;

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
    if (e.target.dataset.action.includes("result")) {
      return operate(calculate);
    }
    if (e.target.dataset.action.includes("reset")) {
      return resetCalculator();
    }
    if (e.target.dataset.action.includes("undo")) {
      return clearInput();
    }
  }

  if (e.target.className.includes("operator")) {
    if (!isOperatorPressedOnce) isOperatorPressedOnce = true;
    else {
      calculate.num1 = calculate.result;
      calculate.num2 = "";
    }

    calculate.operator = e.target.dataset.operator;
    fillinputDisplay(e.target.textContent);
  }

  if (e.target.className.includes("number")) {
    if (isOperatorPressedOnce && calculate.num1 !== "") {
      calculate.num2 += e.target.textContent;
      operate(calculate);
    } else calculate.num1 += e.target.textContent;

    fillinputDisplay(e.target.textContent);
  }
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("clicked");
}

const fillinputDisplay = (inputChar) => {
  if (inputDisplay.textContent.length < 16) {
    inputDisplay.textContent += inputChar;
  } else {
    let newStr = inputDisplay.textContent + inputChar;
    inputDisplay.textContent = newStr.slice(1, newStr.length);
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
  console.log({
    calculate,
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
  console.log("clearInput");
  const string = inputDisplay.textContent;
  inputDisplay.textContent = string.slice(0, string.length - 1);
};

const resetCalculator = () => {
  for (const key in calculate) {
    calculate[key] = "";
  }
  isOperatorPressedOnce = false;
  inputDisplay.textContent = "";
  resultDisplay.textContent = "";
};

const getContentWidth = (element) => {
  let styles = window.getComputedStyle(element);

  return (
    element.clientWidth -
    Number.parseFloat(styles.paddingLeft) -
    Number.parseFloat(styles.paddingRight)
  );
};

const getInputTextWidth = (element) => {
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");
  let txtWidth = ctx.measureText(element.textContent).width;
  return txtWidth;
};

document.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (e.key === "." || (e.key >= 0 && e.key <= 9)) {
    document.querySelector(`button[data-number='${e.key}']`).click();
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
