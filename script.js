//SL Platsuppslag API key: 5046296e5aff4afdb0c02d020ba4fa11
//SL Realtidsinformation 4 API key: 34945e49ddbf432f8dbf2190c14eaf39

//Variabler
var currentStation = "";
var destination = "";
var siteId;

function loadVals(){
    //test för att se se variabler i consol.
    currentStation = localStorage.getItem("_currentStation");
    destination = localStorage.getItem("_destination");
    siteId = localStorage.getItem("_siteId");
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
    //Nollställer avgångar och kör funktionerna platsuppslag och realTimeInfo.
    document.getElementById("avgångar").innerHTML = "";
    platsuppslag(currentStation);
    loadVals();
    realTimeInfo(siteId);
}
function platsuppslag(_currentStation){
    //Hämtar sideId för currentStation via Platsuppslag API
    document.getElementById("avgångarFrån").innerHTML = "Avgångar från " + currentStation;
    const div = document.getElementById("avgångar");
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=5046296e5aff4afdb0c02d020ba4fa11&searchstring=" + currentStation + "&stationsonly=True&maxresults=1";
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        let infos = data.ResponseData;
        
            return infos.map(function (info) {
                localStorage.setItem("_siteId", info.SiteId);
            })
        })
    .catch(function (error) {
        console.log(error);
    });
}
function realTimeInfo(_siteId){
    //Skriver ut avgångsinformation med data från Realtidsinformation API.
    let text = "";
    const div = document.getElementById("avgångar");
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/realtimedeparturesV4.json?key=34945e49ddbf432f8dbf2190c14eaf39&siteid=" + _siteId + "&timewindow=60";
    console.log(_siteId);
    fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
            let infos = data.ResponseData.Metros;

            return infos.map(function (info) {
                if (info.DisplayTime != "Nu") {
                    text = info.LineNumber + " " + info.Destination + " " + info.DisplayTime + "<br>";
                    div.innerHTML += text;
                } 
            })
        })
    .catch(function (error) {
        console.log(error);
    });
}
function laddaData(){
    const span = document.getElementById('information');
    const url = 'https://cors-anywhere.herokuapp.com/http://http://primat.se/services/data/tobbe.classon@hotmail.se-tidtabell_app.json';
    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        let infos = data.data;
        return infos.map(function (info) {
            currentStation = info.Stations;
            document.getElementById("stationTextBox").value = currentStation;
            
        })
      })
      .catch(function (error) {
        console.log(error);
      });
}
function sparaData(){
    const span = document.getElementById('information');
    const url = 'https://cors-anywhere.herokuapp.com/http://http://primat.se/services/sendform.aspx?xid=tidtabell_app&xmail=tobbe.classon@hotmail.se&Station=' + currentStation;
    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        let infos = data.data;
        return infos.map(function (info) {
            
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

