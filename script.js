//SL Platsuppslag API key: 5046296e5aff4afdb0c02d020ba4fa11
//SL Realtidsinformation 4 API key: 34945e49ddbf432f8dbf2190c14eaf39

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
function runFunction(){
    document.getElementById("avgångarFrån").innerHTML = "Avgångar från " + currentStation;
    const div = document.getElementById("avgångar");
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.<json>?key=<5046296e5aff4afdb0c02d020ba4fa11>&searchstring=<Liljeholmen>&stationsonly=<True>&maxresults=<10>";
    fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
            let infos = data.data;
            return infos.map(function (info) {
                div.innerHTML = info.SiteId + " hej";
    })
    })
    .catch(function (error) {
        console.log(error);
    });
}
function showTable(){
    //Funktion som sparar ner currentStation och destination variabler
    //för att kunna öppna de på annat html page samt byter page till tabell.html.
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
    //Funktion för att gå tillbaka till index.html.
    document.location.href = "index.html";
}

