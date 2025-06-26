document.addEventListener('DOMContentLoaded', () => {
    const currentDisplay = document.getElementById('currentDisplay');
    const historyDisplay = document.getElementById('historyDisplay');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '0';
    let history = '';
    let operator = null;
    let previousInput = '';
    let calculationDone = false; // Flag to check if an equals operation was just performed

    function updateDisplay() {
        currentDisplay.textContent = currentInput;
        historyDisplay.textContent = history;
    }

    function clearAll() {
        currentInput = '0';
        history = '';
        operator = null;
        previousInput = '';
        calculationDone = false;
        updateDisplay();
    }

    function clearEntry() {
        currentInput = '0';
        updateDisplay();
    }

    function deleteLast() {
        if (currentInput === 'Error') {
            clearAll();
            return;
        }
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    function appendNumber(number) {
        if (calculationDone) {
            currentInput = number;
            history = '';
            calculationDone = false;
        } else if (currentInput === '0' || currentInput === 'Error') {
            currentInput = number;
        } else {
            currentInput += number;
        }
        updateDisplay();
    }

    function appendDecimal() {
        if (calculationDone) {
            currentInput = '0.';
            history = '';
            calculationDone = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function chooseOperator(nextOperator) {
        if (currentInput === 'Error') return;

        if (operator && previousInput !== '') {
            // If there's an existing operator and previous input, calculate intermediate result
            calculate();
            history = currentDisplay.textContent + ' ' + nextOperator + ' ';
            operator = nextOperator;
            previousInput = currentDisplay.textContent;
            currentInput = '0'; // Reset current input for the next number
        } else {
            operator = nextOperator;
            previousInput = currentInput;
            history = currentInput + ' ' + operator + ' ';
            currentInput = '0'; // Reset current input for the next number
        }
        calculationDone = false; // Reset calculation flag
        updateDisplay();
    }

    function calculate() {
        if (!operator || previousInput === '') {
            history = currentInput; // If no operation, just show current input as history
            calculationDone = true;
            updateDisplay();
            return;
        }

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) {
            currentInput = 'Error';
            history = '';
            updateDisplay();
            return;
        }

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '−': // Minus sign
            case '-': // Hyphen for keyboard
                result = prev - current;
                break;
            case '×': // Times sign
            case '*': // Asterisk for keyboard
                result = prev * current;
                break;
            case '÷': // Division sign
            case '/': // Slash for keyboard
                if (current === 0) {
                    currentInput = 'Error';
                    history = '';
                    updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        history = previousInput + ' ' + operator + ' ' + currentInput + ' =';
        currentInput = result.toString();
        operator = null;
        previousInput = '';
        calculationDone = true;
        updateDisplay();
    }

    function applyFunction(func) {
        if (currentInput === 'Error') return;

        let num = parseFloat(currentInput);
        if (isNaN(num)) {
            currentInput = 'Error';
            history = '';
            updateDisplay();
            return;
        }

        let result;
        switch (func) {
            case '%':
                result = num / 100;
                history = num + ' % =';
                break;
            case 'x²':
                result = num * num;
                history = num + '² =';
                break;
            case '√x':
                if (num < 0) {
                    currentInput = 'Error';
                    history = '';
                    updateDisplay();
                    return;
                }
                result = Math.sqrt(num);
                history = '√(' + num + ') =';
                break;
            case '+/-':
                result = num * -1;
                history = 'negate(' + num + ') ='; // For display clarity
                break;
            default:
                return;
        }
        currentInput = result.toString();
        calculationDone = true;
        updateDisplay();
    }


    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            handleInput(buttonText);
        });
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        // Prevent default behavior for calculator-relevant keys
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', 'Enter', 'Backspace', 'Escape'].includes(key)) {
            e.preventDefault();
        }

        if (/\d/.test(key)) { // Numbers 0-9
            handleInput(key);
        } else if (key === '.') {
            handleInput('.');
        } else if (key === '+') {
            handleInput('+');
        } else if (key === '-') {
            handleInput('−'); // Use the '−' character for display consistency
        } else if (key === '*' || key === 'x') { // Accept both * and x for multiplication
            handleInput('×'); // Use the '×' character for display consistency
        } else if (key === '/') {
            handleInput('÷'); // Use the '÷' character for display consistency
        } else if (key === '=' || key === 'Enter') {
            handleInput('=');
        } else if (key === 'Backspace') {
            handleInput('⌫');
        } else if (key === 'Escape') { // 'Esc' for clear all
            handleInput('C');
        }
        // No specific key for CE, %, x², √x, +/- for now, can be added if needed
    });

    function handleInput(input) {
        if (input === 'C') {
            clearAll();
        } else if (input === 'CE') {
            clearEntry();
        } else if (input === '⌫') {
            deleteLast();
        } else if (input === '.') {
            appendDecimal();
        } else if (['+', '−', '×', '÷'].includes(input)) {
            chooseOperator(input);
        } else if (input === '=') {
            calculate();
        } else if (['%', 'x²', '√x', '+/-'].includes(input)) {
            applyFunction(input);
        } else if (/\d/.test(input)) { // Check if it's a digit
            appendNumber(input);
        }
    }

    // Initial display setup
    updateDisplay();
});