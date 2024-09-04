// ============================================
// Change these numbers to configure lottery
// ============================================
const numberOfDigitsToGenerate = 3;
const lowestDigitToGenerate = 1;
const highestDigitToGenerate = 9;
// ============================================

var validNumbers = [];
var availableNumbers = [];

var numbers = [];
var entries = new Map();

function generateValidNumbers() {
    var validNumber;
    for (let a = 1; a <= 9; a++) {
        for (let b = 1; b <= 9; b++) {
            if (a != b) {
            }
            else {
                continue;
            }
            for (let c = 1; c <= 9; c++) {
                if (a != c && b != c) {
                    validNumber = a * 100;
                    validNumber += b * 10;
                    validNumber += c;
                    validNumbers.push(validNumber);
                }
                else {
                    continue;
                }
            }
        }
    }
    availableNumbers = Array.from(validNumbers);
    console.log(availableNumbers);
    updateTicketCount();
}

function updateTicketCount() {
    document.getElementById("count").innerHTML = "Tickets remaining: " + availableNumbers.length;
}

function assign() {
    document.getElementById("warning").innerHTML = "";
    if (availableNumbers.length < 1) {
        document.getElementById("warning").innerHTML = "No tickets left!";
        return;
    }

    var name = document.getElementById("name").value;
    for (let i = 0; i < document.getElementById("amount").value; i++) {
        if (availableNumbers.length < 1) {
            document.getElementById("warning").innerHTML = "No tickets left!";
            updateTicketCount();
            return;
        }
        var index = getRandomInt(availableNumbers.length - 1);
        var num = availableNumbers[index];
        entries.set(num, name);
        document.getElementById("results").innerHTML += "<tr><td>" + name + "</td><td>" + num + "</td></tr>";
        availableNumbers.splice(index, 1);
    }

    // document.getElementById("results").firstElementChild.innerHTML = "<tr><th>Name</th><th>Number (" + availableNumbers.length + ")</th></tr>";
    updateTicketCount();
}

function assignCustom() {
    document.getElementById("warning").innerHTML = "";
    if (availableNumbers.length < 1) {
        document.getElementById("warning").innerHTML = "No tickets left!";
        return;
    }
    
    var name = document.getElementById("name").value;
    var customNumber = Number(document.getElementById("number").value);
    console.log(customNumber);
    if (availableNumbers.includes(customNumber)) {
        var index = availableNumbers.indexOf(customNumber);
        var num = availableNumbers[index];
        entries.set(num, name);
        document.getElementById("results").innerHTML += "<tr><td>" + name + "</td><td>" + num + "</td></tr>";
        availableNumbers.splice(index, 1);
        // document.getElementById("results").firstElementChild.innerHTML = "<tr><th>Name</th><th>Number (" + availableNumbers.length + ")</th></tr>";
        updateTicketCount();
    }
    else if (validNumbers.includes(customNumber)) {
        document.getElementById("warning").innerHTML = "Number already taken!";
    }
    else {
        document.getElementById("warning").innerHTML = "Number is invalid!";
    }
}

function generate() {
    document.getElementById("warning").innerHTML = "";
    var name = document.getElementById("name").value;
    for (let i = 0; i < document.getElementById("amount").value; i++) {
        var num = generateNumber(numberOfDigitsToGenerate);
        entries.set(num, name);
        document.getElementById("results").innerHTML += "<tr><td>" + name + "</td><td>" + num + "</td></tr>";
    }

    document.getElementById("results").firstElementChild.innerHTML = "<tr><th>Name</th><th>Number (" + numbers.length + ")</th></tr>";
}

function pickWinner() {
    // var winningNumber = numbers[getRandomInt(numbers.length - 1)];
    var winningNumber = validNumbers[getRandomInt(validNumbers.length - 1)];
    var winner = "None";
    if (entries.has(winningNumber)){
        winner = entries.get(winningNumber);
    }
    document.getElementById("winner").innerHTML = winningNumber + "<br>" + winner;
}

function generateNumber(numberOfDigits) {
    var total = 0;
    var pow = 10;
    for (let i = 0; i < numberOfDigits; i++) {
        if (i == 0) {
            total = generateDigit(lowestDigitToGenerate, highestDigitToGenerate);
        }
        else {
            total += generateDigit(lowestDigitToGenerate, highestDigitToGenerate) * pow;
            pow *= 10;
        }
    }

    if (numbers.includes(total)) {
        total = generateNumber(numberOfDigits);
        return total;
    }
    numbers.push(total);

    return total;
}

function generateDigit(lowestDigit, highestDigit) {
    if (highestDigit > 9) {
        throw new Error('highestDigit is more than one digit.');
    }
    if (lowestDigit > 9) {
        throw new Error('lowestDigit is more than one digit.');
    }
    if (highestDigit < 0) {
        throw new Error('highestDigit is negative.');
    }
    if (lowestDigit < 0) {
        throw new Error('lowestDigit is negative.');
    }
    if (lowestDigit > highestDigit) {
        throw new Error('lowestDigit is greater than highestDigit. highestDigit must always be bigger than lowerDigit');
    }
    return getRandomInt(highestDigit - lowestDigit) + lowestDigit;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function saveResults() {
    download(JSON.stringify(Object.fromEntries(entries)), "tickets.json", "application/json")
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
