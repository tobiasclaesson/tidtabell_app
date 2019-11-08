
//SL Platsuppslag API key: 5046296e5aff4afdb0c02d020ba4fa11
//SL Realtidsinformation 4 API key: 34945e49ddbf432f8dbf2190c14eaf39

//Variabler
var currentStation = "";
var walkTime = 0;
var siteId;

function loadVals(){
    //test för att se se variabler i consol.

    currentStation = localStorage.getItem("_currentStation");
    walkTime = localStorage.getItem("_walkTime");
    //siteId = localStorage.getItem("_siteId");
}
function _loadVals(){
    //test för att se se variabler i consol.
    currentStation = localStorage.getItem("_currentStation");

    laddaData();

    //if (currentStation != "") {
        //document.getElementById("stationTextBox").value = currentStation;
        //document.getElementById("destinationTextBox").value = destination;
    //}
}
function runFunction(){
    //Nollställer avgångar och kör funktionerna platsuppslag och realTimeInfo.
    document.getElementById("avgångar").innerHTML = "";
    loadVals();
    platsuppslag(currentStation);
    //console.log(siteId + " runFunc");
    //loadVals();
    //realTimeInfo(siteId);
}
function platsuppslag(_currentStation){
    //Hämtar sideId för currentStation via Platsuppslag API
    //loadVals();
    document.getElementById("avgångarFrån").innerHTML = "Avgångar från " + currentStation;
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=5046296e5aff4afdb0c02d020ba4fa11&searchstring=" + currentStation + "&stationsonly=True&maxresults=1";
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        let infos = data.ResponseData;
        
            return infos.map(function (info) {
                siteId = info.SiteId;
                //localStorage.setItem("_siteId", info.SiteId);
                console.log(siteId + " platsupp");
                realTimeInfo(siteId);
            })
        })
    .catch(function (error) {
        console.log(error);
    });
}
function realTimeInfo(_siteId){
    //Skriver ut avgångsinformation med data från Realtidsinformation API.
    //loadVals();
    //let currentTime = Date.parse("2019-11-08T10:55:25");
    //let currentTime = Date.parse("YYYY-MM-DDTHH:mm:ss");
    console.log(_siteId + " realtimeinfo1");
    let currentTime = new Date();
    let avgångTime;
    let text = "";
    let diffMins;
    let diffWalk;
    let gåOm;
    
    const div = document.getElementById("avgångar");
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/realtimedeparturesV4.json?key=34945e49ddbf432f8dbf2190c14eaf39&siteid=" + _siteId + "&timewindow=25";
    fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
            let infos = data.ResponseData.Metros;

            return infos.map(function (info) {
                avgångTime = new Date(Date.parse(info.ExpectedDateTime));
                

                diffMins = (avgångTime - currentTime) / 1000 / 60;
                diffWalk = diffMins - walkTime;
                gåOm = (Math.floor(diffMins - walkTime)) + " min";
                if (gåOm == (0 + " min")) {
                    gåOm = "Nu";
                }
                if(diffWalk > 0){
                    //Körs om "Nu" finns med i DisplayTime Stringen.
                    if (info.DisplayTime == "Nu"){
                        info.DisplayTime = "0 min"
                        
                        text = info.LineNumber + " " + info.Destination + " " + info.DisplayTime + " " + gåOm + "<br>";
                        div.innerHTML += text;
                    }
                    //Körs om tecknet ":" finns i DisplayTime.
                    else if (info.DisplayTime.indexOf(":") > -1) {
                        avgångTime = new Date(Date.parse(info.ExpectedDateTime));
                        
                        diffMins = (avgångTime - currentTime) / 1000 / 60;

                        info.DisplayTime = Math.floor(diffMins) + " min";

                        text = info.LineNumber + " " + info.Destination + " " + info.DisplayTime + " " + gåOm + "<br>";
                        div.innerHTML += text;
                    }

                    else{
                        //Körs om inga andra villkor stämmer.
                        text = info.LineNumber + " " + info.Destination + " " + info.DisplayTime + " " + gåOm + "<br>";
                        div.innerHTML += text;
                    }
                }
                /* else{
                    div.innerHTML += "Fel";
                } */
            })
        })
    .catch(function (error) {
        console.log(error);
    });
}
function laddaData(){
    //Laddar data till textBoxes.
    const url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/tobbe.classon@hotmail.se-tidtabell_app.json';
    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        let infos = data.data;
        return infos.map(function (info) {
            document.getElementById("stationTextBox").value = info.Station;
            document.getElementById("walkTimeBox").value = info.WalkTime;

            
        })
      })
      .catch(function (error) {
        console.log(error);
      });
}
function sparaData(){
    //Sparar data från textBoxes
    const url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=tidtabell_app&xmail=tobbe.classon@hotmail.se&Station=' + currentStation + "&WalkTime=" + walkTime;
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
    walkTime = document.getElementById("walkTimeBox").value;
    //destination = document.getElementById("destinationTextBox").value;

    localStorage.setItem("_currentStation", currentStation);
    localStorage.setItem("_walkTime", walkTime);
    sparaData();
    //localStorage.setItem("_destination", destination);

    document.location.href = "tabell.html";
}
/* function swapText(){
    //Funktion som byter plats på currentStation och destination.
    var current = document.getElementById("stationTextBox").value;
    var dest = document.getElementById("destinationTextBox").value;

    document.getElementById("stationTextBox").value = dest;
    document.getElementById("destinationTextBox").value = current;
} */
function goBack(){
    //Funktion för att gå tillbaka till index.html.
    document.location.href = "index.html";
}

/* diff = info.ExpectedDateTime - currentTime;
                        diffMins = Math.round(diff / 60000);
                        console.log(diffMins); */
