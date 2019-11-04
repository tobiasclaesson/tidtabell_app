//Variabler
var currentStation = "";
var destination = "";

function loadVals(){
    //test för att se se variabler i consol.
    currentStation = localStorage.getItem("_currentStation");
    destination = localStorage.getItem("_destination");
    console.log(currentStation);
    console.log(destination);
}
function _loadVals(){
    //test för att se se variabler i consol.
    currentStation = localStorage.getItem("_currentStation");
    destination = localStorage.getItem("_destination");
    console.log(currentStation);
    console.log(destination);
    if (currentStation != "") {
        document.getElementById("stationTextBox").value = currentStation;
        document.getElementById("destinationTextBox").value = destination;
    }
}
function showTable(){
    //Funktion som sparar ner currentStation och destination variabler
    //för att kunna öppna de på annat html page samt byter page till tabell.html
    currentStation = document.getElementById("stationTextBox").value;
    destination = document.getElementById("destinationTextBox").value;

    localStorage.setItem("_currentStation", currentStation);
    localStorage.setItem("_destination", destination);

    document.location.href = "tabell.html";
}
function swapText(){
    //Funktion som byter plats på currentStation och destination.
    var current = document.getElementById("stationTextBox").value;
    var dest = document.getElementById("destinationTextBox").value;

    document.getElementById("stationTextBox").value = dest;
    document.getElementById("destinationTextBox").value = current;
}
function goBack(){
    document.location.href = "index.html";
}
