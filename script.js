let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
let history = [];
let isPoweredOn = true;
const screen = document.getElementById('screen');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');
const clearHistoryBtn = document.getElementById('clearHistory');
const powerToggle = document.getElementById('powerToggle');
const wrapper = document.querySelector('.wrapper');

function togglePower() {
    isPoweredOn = !isPoweredOn;
    powerToggle.textContent = isPoweredOn ? '🟢' : '🔴';
    wrapper.classList.toggle('powered-off', !isPoweredOn);
    if (!isPoweredOn) {
        screen.innerText = '';
    } else {
        updateScreen();
    }
}

function buttonClick(value) {
    if (!isPoweredOn) return;
    if (isNaN(value) && !['.', '%', '√'].includes(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    updateScreen();
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            buffer = '0';
            runningTotal = 0;
            previousOperator = null;
            break;
        case '=':
            if (previousOperator === null) return;
            const result = flushOperation(parseFloat(buffer));
            addToHistory(buffer + ' ' + previousOperator + ' ' + buffer + ' = ' + result);
            previousOperator = null;
            buffer = result.toString();
            runningTotal = 0;
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '%':
            buffer = (parseFloat(buffer) / 100).toString();
            break;
        case '√':
            const sqrtVal = Math.sqrt(parseFloat(buffer));
            if (isNaN(sqrtVal)) {
                screen.innerText = 'Error';
                return;
            }
            buffer = sqrtVal.toString();
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    const intBuffer = parseFloat(buffer);
    if (isNaN(intBuffer)) return;

    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }
    previousOperator = symbol;
    buffer = '0';
}

function flushOperation(intBuffer) {
    let result;
    if (previousOperator === '+') {
        result = runningTotal += intBuffer;
    } else if (previousOperator === '−') {
        result = runningTotal -= intBuffer;
    } else if (previousOperator === '×') {
        result = runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        if (intBuffer === 0) {
            screen.innerText = 'Error';
            buffer = '0';
            return 'Error';
        }
        result = runningTotal /= intBuffer;
    }
    return result;
}

function handleNumber(numberString) {
    if (buffer === '0' || buffer === 'Error') {
        buffer = numberString;
    } else if (numberString === '.' && buffer.includes('.')) {
        return;
    } else {
        buffer += numberString;
    }
}

function updateScreen() {
    if (buffer === 'Error') {
        screen.innerText = 'Error';
    } else {
        screen.innerText = parseFloat(buffer).toString() === buffer ? parseFloat(buffer).toString() : buffer;
    }
    // Font size adjust
    const textLength = screen.innerText.length;
    screen.style.fontSize = textLength > 12 ? '28px' : '35px';
}

function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) history.pop();
    updateHistory();
}

function updateHistory() {
    historyList.innerHTML = history.slice(0, 10).map(h => `<div>${h}</div>`).join('');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
}

// Event listeners
document.querySelector('.calc-buttons').addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        buttonClick(e.target.dataset.value || e.target.innerText);
    }
});

document.querySelector('.header').addEventListener('click', (e) => {
    if (e.target.id === 'themeToggle') toggleTheme();
    if (e.target.id === 'powerToggle') togglePower();
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    updateHistory();
});

function handleKeyboard(event) {
    if (event.key === 'p' || event.key === 'P') {
        togglePower();
        return;
    }
    const key = event.key;
    if (!isNaN(key) || key === '.') {
        buttonClick(key);
        return;
    }
    switch (key) {
        case '/': buttonClick('÷'); break;
        case '*': buttonClick('×'); break;
        case '-': buttonClick('−'); break;
        case '+': buttonClick('+'); break;
        case 'Enter': case '=': buttonClick('='); break;
        case 'Backspace': buttonClick('←'); break;
        case 'Escape': buttonClick('C'); break;
    }
}

document.addEventListener('keydown', handleKeyboard);

function init() {
    updateScreen();
    updateHistory();
}

init();

