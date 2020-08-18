"use-strict";
(() => {
  //Global Variables
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

  /**
   * Return a boolean,indicating provided String is empty.
   * @param {String} str - String Argument
   * @return {Boolean}   - true if str is undefined, null or '', else false
   */
  const isEmpty = (str) => !str || str.length === 0;

  /**
   * Return a boolean,indicating provided character is operator.
   * @param {String} inputChar - an operator or number
   * @return {Boolean}         - true if inputChar is operator, else false
   */
  const isOperator = (inputChar) => {
    return ["+", "-", "x", "%", "÷"].some((item) => item === inputChar);
  };

  /**
   * Check the result for decimal places to precise it &
   * return result in String form
   * @param {String|Number} result - an Error Message or number
   * @return {String}              - Error message, result or
   * if result is decimal then precise it to two decimal places.
   */
  const filterResult = (result) => {
    return Number.isNaN(Number(result))
      ? result
      : result % 1 != 0
      ? result.toFixed(2)
      : result.toString();
  };

  const add = (num1, num2) => num1 + num2;

  const substract = (num1, num2) => num1 - num2;

  const multiply = (num1, num2) => num1 * num2;

  const divide = (num1, num2) => (num2 === 0 ? "GET OUT !!" : num1 / num2);

  const percentage = (num1, num2) =>
    num2 !== "" ? (num1 / 100) * num2 : num1 / 100;

  /**
   * Performing mathematical operation.
   *  @param {String} num1 - firstOperand in operation
   *  @param {String} num2 - SecondOperand in operation
   *  @param {String} operator - Operation to perform '+','-','x' etc.
   */
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

  /**
   * Re-assign the global variables to its default values.
   */
  const resetCalculator = () => {
    for (const key in calculate) {
      calculate[key] = "";
    }
    inputDisplay.textContent = "\u00A0";
    resultDisplay.textContent = "\u00A0";
    resultStack = [];
    inputCharStack = [];
  };

  /**
   * Undo the previous operation like repopulating the previous result and
   * input character, to inputDisplay & resultDisplay.
   */
  const undoOperation = () => {
    let inputCharStackString = inputCharStack.join("");
    let inputString = "";
    let lastInputChar = "";
    let endIdx = "";
    let startIdx = "";
    let secondLastEntry = "";

    if (!inputCharStackString.length && calculate.num2 === 0) {
      return;
    }

    {
      endIdx = inputCharStackString.length;
      startIdx = endIdx - inputDisplay.textContent.trim().length;
      inputString = inputCharStackString.slice(startIdx, endIdx);
      secondLastEntry = { ...resultStack[resultStack.length - 2] };
      lastInputChar = inputCharStack.pop();
    }

    if (!Number.isNaN(Number(lastInputChar))) {
      if (isEmpty(Object.entries(secondLastEntry))) {
        resetCalculator();
        return;
      } else {
        calculate = { ...secondLastEntry };
        if (isOperator(inputCharStack[inputCharStack.length - 1])) {
          calculate.num1 = calculate.result;
          calculate.num2 = "";
        }
        resultDisplay.textContent = secondLastEntry.result;
        resultStack.pop();
      }
    }

    if (startIdx - 1 >= 0) {
      inputDisplay.textContent = inputCharStackString.slice(startIdx - 1, -1);
    } else {
      inputDisplay.textContent = inputCharStackString.slice(startIdx, -1);
    }
  };

  /**
   * Populate the calculated result to resultDisplay of Calculator
   * @param {String} finalAnswer - Contain final calculated value of expression.
   */
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
      resultDisplay.textContent = Number.parseFloat(finalAnswer).toExponential(
        2
      );
    }
  };

  /**
   * Populate the character to inputDisplay of Calculator & prevent display content
   * overflow when input character size exceed to limit.
   * @param {String} inputChar - Contain value of clicked number & operator buttons.
   */
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

  /**
   * Call when any action(reset,undo or assign) button is click.
   * @param {Object} e - The MouseClickEvent Object
   */
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
      return undoOperation();
    }
  };
  /**
   * Call when any operator is clicked. Store the current clicked operator to
   * calculate object & handle the re-initialization of num1 & num2.
   * @param {Object} e - The MouseClickEvent Object
   */
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

  /**
   * Call when any number button is clicked. Store the input number to calculate object.
   * @param {Object} e - The MouseClickEvent Object
   */
  const handleNumberClick = (e) => {
    if (isEmpty(calculate.operator) && isEmpty(calculate.result)) {
      calculate.num1 += e.target.dataset.number;
    } else {
      calculate.num2 += e.target.dataset.number;
      operate(calculate);
    }
    inputCharStack.push(e.target.dataset.number);
    fillinputDisplay(e.target.dataset.number);
  };

  /**
   * Call when decimal button is clicked. Used to append decimal to exact number,
   * and prevent insertion of multiple decimal point to same number.
   * @param {Object} e - The MouseClickEvent Object
   */
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

  /**
   * Event handler for 'click' events caused by mouse-click.
   * @param {Object} e - The MouseClickEvent triggering this function
   */
  const activateButtons = (e) => {
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
  };

  /**
   * Event handler for 'transitionend' events occur when duration of transition
   * property defined for html element end.
   * @param {Object} e - The TransitionEnd event triggering this function.
   */
  const removeTransition = (e) => {
    if (e.propertyName !== "transform") return;
    e.target.classList.remove("clicked");
  };

  /**
   * Event handler for 'keydown' events caused by keyboard button pressed.
   * @param {Object} e - The keyboardEvent triggering this function.
   */
  const handleKeyEvent = (e) => {
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
  };

  // Add click event listner on container only (Event Delegation Concept)
  buttonContainer.addEventListener("click", activateButtons);
  // Add transitionend event listner on container to style calc button when keyboard buttons are pressed
  buttonContainer.addEventListener("transitionend", removeTransition);
  // Add keydown event listener for keyboard button pressed
  document.addEventListener("keydown", handleKeyEvent);
})(); /* Invoke function to prevent global access of varialbes & function to console */
