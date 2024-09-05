var validNumbers = [];
var availableNumbers = [];
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
        updateTicketCount();
    }
    else if (validNumbers.includes(customNumber)) {
        document.getElementById("warning").innerHTML = "Number already taken!";
    }
    else {
        document.getElementById("warning").innerHTML = "Number is invalid!";
    }
}

function pickWinner() {
    var winningNumber = validNumbers[getRandomInt(validNumbers.length - 1)];
    var winner = "None";
    if (entries.has(winningNumber)) {
        winner = entries.get(winningNumber);
    }
    document.getElementById("winner").innerHTML = winningNumber + "<br>" + winner;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function saveResults() {
    download(JSON.stringify(Object.fromEntries(entries)), "tickets.json", "application/json")
}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function readFile(input) {
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        console.log(reader.result);
        var newEntries = new Map(Object.entries(JSON.parse(reader.result)));
        for (const [key, value] of newEntries) {
            loadEntry(key, value);
        }
        console.log(entries);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };

}

function loadEntry(key, value) {
    document.getElementById("warning").innerHTML = "";
    if (availableNumbers.length < 1) {
        document.getElementById("warning").innerHTML = "No tickets left!";
        return;
    }
    
    var name = value;
    var customNumber = Number(key);
    console.log(customNumber);
    if (availableNumbers.includes(customNumber)) {
        var index = availableNumbers.indexOf(customNumber);
        var num = availableNumbers[index];
        entries.set(num, name);
        document.getElementById("results").innerHTML += "<tr><td>" + name + "</td><td>" + num + "</td></tr>";
        availableNumbers.splice(index, 1);
        updateTicketCount();
    }
    else if (validNumbers.includes(customNumber)) {
        document.getElementById("warning").innerHTML = "Number already taken!";
    }
    else {
        document.getElementById("warning").innerHTML = "Number is invalid!";
    }
}