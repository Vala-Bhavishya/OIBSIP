const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const buttons = document.querySelectorAll(".btn");
 
const MAX_DIGITS = 15;
 
// Calculator state
let current = "0";      // number currently shown / being typed (string)
let previous = null;    // stored left-hand number (number)
let operator = null;    // pending operator: + − × ÷
let resetNext = false;  // true when the next digit should start a new number
let hasError = false;
 
/* ---------- Core math (no eval) ---------- */
 
function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "−":
            return a - b;
        case "×":
            return a * b;
        case "÷":
            if (b === 0) return null; // division by zero
            return a / b;
        default:
            return b;
    }
}
 
// Trims floating point noise, e.g. 0.1 + 0.2 -> 0.3
function formatResult(num) {
    return parseFloat(num.toPrecision(12)).toString();
}
 
/* ---------- Display ---------- */
 
function updateDisplay() {
    displayEl.textContent = current;
    displayEl.classList.toggle("error", hasError);
 
    if (hasError) {
        historyEl.textContent = "";
    } else if (operator !== null) {
        historyEl.textContent = formatResult(previous) + " " + operator;
    }
}
 
function showError(message) {
    current = message;
    previous = null;
    operator = null;
    resetNext = true;
    hasError = true;
    updateDisplay();
}
 
/* ---------- Actions ---------- */
 
function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    hasError = false;
    historyEl.textContent = "";
    updateDisplay();
}
 
function appendNumber(digit) {
    if (hasError) clearAll();
 
    if (resetNext) {
        current = digit;
        resetNext = false;
    } else if (current.replace(/[-.]/g, "").length < MAX_DIGITS) {
        current = current === "0" ? digit : current + digit;
    }
    updateDisplay();
}
 
function appendDecimal() {
    if (hasError) clearAll();
 
    if (resetNext) {
        current = "0.";
        resetNext = false;
    } else if (!current.includes(".")) {
        current += ".";
    }
    updateDisplay();
}
 
function backspace() {
    if (hasError) {
        clearAll();
        return;
    }
    if (resetNext) return; // don't edit a finished result
 
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
    updateDisplay();
}
 
function chooseOperator(op) {
    if (hasError) return;
 
    // Changed their mind: just swap the operator
    if (operator !== null && resetNext) {
        operator = op;
        updateDisplay();
        return;
    }
 
    // Chaining: evaluate the pending operation first
    if (operator !== null) {
        const result = calculate(previous, parseFloat(current), operator);
        if (result === null) {
            showError("Cannot divide by 0");
            return;
        }
        previous = result;
        current = formatResult(result);
    } else {
        previous = parseFloat(current);
    }
 
    operator = op;
    resetNext = true;
    updateDisplay();
}
 
function evaluate() {
    if (hasError || operator === null) return;
 
    const right = parseFloat(current);
    const result = calculate(previous, right, operator);
 
    if (result === null) {
        showError("Cannot divide by 0");
        return;
    }
 
    historyEl.textContent = formatResult(previous) + " " + operator + " " + formatResult(right) + " =";
    current = formatResult(result);
    previous = null;
    operator = null;
    resetNext = true;
    displayEl.textContent = current;
    displayEl.classList.remove("error");
}
 
/* ---------- Button listeners ---------- */
 
buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        const type = button.dataset.type;
        const value = button.dataset.value;
 
        switch (type) {
            case "number":
                appendNumber(value);
                break;
            case "decimal":
                appendDecimal();
                break;
            case "operator":
                chooseOperator(value);
                break;
            case "equals":
                evaluate();
                break;
            case "clear":
                clearAll();
                break;
            case "backspace":
                backspace();
                break;
        }
    });
});
 
/* ---------- Keyboard support (bonus) ---------- */
 
const keyOperators = { "+": "+", "-": "−", "*": "×", "/": "÷" };
 
document.addEventListener("keydown", function (event) {
    const key = event.key;
 
    if (key >= "0" && key <= "9") {
        appendNumber(key);
    } else if (key === ".") {
        appendDecimal();
    } else if (keyOperators[key]) {
        event.preventDefault(); // stops "/" opening quick-find in some browsers
        chooseOperator(keyOperators[key]);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        evaluate();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape" || key.toLowerCase() === "c") {
        clearAll();
    }
});
 
updateDisplay();