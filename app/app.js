const input = document.querySelector('input');
const messages = {
    NO_NUMBER: 'No number provided'
};

console.log(Number.MAX_VALUE);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MAX_SAFE_INTEGER + 1);
console.log(Number.MAX_SAFE_INTEGER + 2);
console.log(Number.MAX_SAFE_INTEGER + 8);

input.addEventListener('input', () => {
    const value = input.value.trim();
    displayEntry(value);
    displayStringLength(value);
    displayNumberLengthDivision(value);
    displayNumberLengthExponent(value);
    displayNumber(value);
});

function entryInvalid(value) {
    return isNaN(Number(value)) || !value;
}

function displayEntry(value) {
    const display = document.querySelector('#original-number');
    const displayLength = document.querySelector('#original-string-length');

    display.textContent = (entryInvalid(value)) ? messages.NO_NUMBER : value;
    displayLength.textContent = (entryInvalid(value)) ? 0 : value.length;
}

function displayNumber(value) {
    const display = document.querySelectorAll('.number');
    const text = (entryInvalid(value)) ? '' : Number(value);
    for (let i = 0; i < display.length; i++) {
        display[i].textContent = text.toString();
    }
}

function displayStringLength(value) {
    const display = document.querySelector('#string-length');
    const text = (entryInvalid(value)) ? '' : Number(value);
    display.textContent = text.toString().length;
}

function displayNumberLengthDivision(value) {
    const display = document.querySelector('#number-length-division');
    let number = (entryInvalid(value)) ? 0 : Number(value);

    let length = 0;
    while (number >= 1) {
        number = number / 10;
        length++;
    }

    display.textContent = length;
}

function displayNumberLengthExponent(value) {
    const display = document.querySelector('#number-length-exponent');
    const number = (entryInvalid(value)) ? 0 : Number(value);
    const string = number.toString();
    const hasExponent = string.indexOf('e') !== -1;

    display.textContent = (hasExponent) ? +number.toString().split('e')[1].substring(1) + 1 : number.toString().length;
}
