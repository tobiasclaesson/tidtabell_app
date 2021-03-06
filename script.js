//Script till Tidtabell app.
//Programmerare: Tobias Claesson
//Datum: 19-11-14

//Variabler
var currentStation = "";
var walkTime = 0;
var siteId;

function loadVals(){
    //Laddar in variabler från local storage
    currentStation = localStorage.getItem("_currentStation");
    walkTime = localStorage.getItem("_walkTime");
}

function runFunction(){
    //Nollställer avgångar och kör funktionerna platsuppslag och realTimeInfo.
    document.getElementById("avgångTable").innerHTML = "";
    loadVals();
    platsuppslag(currentStation);
}
function platsuppslag(_currentStation){
    //Hämtar sideId för currentStation via Platsuppslag API
    document.getElementById("avgångarFrån").innerHTML = "Avgångar från " + currentStation;
    sparaData();
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=5046296e5aff4afdb0c02d020ba4fa11&searchstring=" + currentStation + "&stationsonly=True&maxresults=1";
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        let infos = data.ResponseData;
        
            return infos.map(function (info) {
                siteId = info.SiteId;
                realTimeInfo(siteId);
            })
        })
    .catch(function (error) {
        console.log(error);
    });
}
function realTimeInfo(_siteId){
    //Skriver ut avgångsinformation med data från Realtidsinformation API.
    let currentTime = new Date();
    let avgångTime;
    let text = "";
    let diffMins;
    let diffWalk;
    let gåOm;
    let i = 1;

    const div = document.getElementById("avgångTable");
    const url = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/realtimedeparturesV4.json?key=34945e49ddbf432f8dbf2190c14eaf39&siteid=" + _siteId + "&timewindow=60";
    fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
            let infos = data.ResponseData.Metros;

            return infos.map(function (info) {
                //kortar ner Destinationsträngen till max 11 bokstäver + ".." för att man ska
                //se att strängen är nedkortad.
                let dest = info.Destination;
                if (dest.length > 11) {
                    dest = dest.substring(0,11) + "..";
                }
                //Gör så att endast de första 15 avgångarna visas
                if (i <= 15){
                    //Räknar ut mellanskillnaden medan tid till avgång och walkTime.
                    avgångTime = new Date(Date.parse(info.ExpectedDateTime));
                    diffMins = (avgångTime - currentTime) / 1000 / 60;
                    diffWalk = diffMins - walkTime;
                    gåOm = (Math.floor(diffMins - walkTime)) + " min";
                    //Sätter variabeln gåOm till "Nu" om avgången går om 0 min.
                    if (gåOm == (0 + " min")){
                        gåOm = "Nu";
                    }
                    //Körs bara om diffWalk är större än 0.
                    if(diffWalk > 0){
                        //Körs om "Nu" finns med i DisplayTime Stringen.
                        if (info.DisplayTime == "Nu"){
                            info.DisplayTime = "0 min"
                            
                            //Om variabeln gåOm är mindre än 6 skrivs den ut i röd text, annars skrivs allt ut i gult.
                            if (diffWalk < 6) {
                                text = "<table><tr><td id='lineCol'>" + info.LineNumber + "</td><td id='destCol'>" + dest + "</td><td>" + info.DisplayTime + "</td><td id='gåOmCol'>" + gåOm + "</td></tr></table>";
                                div.innerHTML += text;
                                i++;
                            }
                            else{
                                text = "<table><tr><td id='lineCol'>" + info.LineNumber + "</td><td id='destCol'>" + dest + "</td><td>" + info.DisplayTime + "</td><td>" + gåOm + "</td></tr></table>";
                                div.innerHTML += text;
                                i++;
                            }
                        }
                        //Körs om tecknet ":" finns i DisplayTime.
                        else if (info.DisplayTime.indexOf(":") > -1){
                            avgångTime = new Date(Date.parse(info.ExpectedDateTime));
                            
                            diffMins = (avgångTime - currentTime) / 1000 / 60;

                            info.DisplayTime = Math.floor(diffMins) + "min";
                            //Om variabeln gåOm är mindre än 6 skrivs den ut i röd text, annars skrivs allt ut i gult.
                            if (diffWalk < 6) {
                                text = "<table><tr><td id='lineCol'>" + info.LineNumber + "</td><td id='destCol'>" + dest + "</td><td>" + info.DisplayTime + "</td><td id='gåOmCol'>" + gåOm + "</td></tr></table>";
                                div.innerHTML += text;
                                i++;
                            }
                            else{
                                text = "<table><tr><td id='lineCol'>" + info.LineNumber + "</td><td id='destCol'>" + dest + "</td><td>" + info.DisplayTime + "</td><td>" + gåOm + "</td></tr></table>";
                                div.innerHTML += text;
                                i++;
                            }
                        }
                        else{
                            //Körs om inga andra villkor stämmer.
                            //Om variabeln gåOm är mindre än 6 skrivs den ut i röd text, annars skrivs allt ut i gult.
                            if (diffWalk < 6) {
                                text = "<table><tr><td id='lineCol'>" + info.LineNumber + "</td><td id='destCol'>" + dest + "</td><td>" + info.DisplayTime + "</td><td id='gåOmCol'>" + gåOm + "</td></tr></table>";
                                div.innerHTML += text;
                                i++;
                            }
                            else{
                                text = "<table><tr><td id='lineCol'>" + info.LineNumber + "</td><td id='destCol'>" + dest + "</td><td>" + info.DisplayTime + "</td><td>" + gåOm + "</td></tr></table>";
                                div.innerHTML += text;
                                i++;
                            }
                        }
                    }
                }
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
            console.log(info.Stations + " laddar");
            console.log(info.WalkTime + " laddar");
            
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
            console.log(currentStation + " sparar");
        })
      })
      .catch(function (error) {
        console.log(error);
      });
}
function showTable(){
    //Funktion som sparar ner currentStation och walkTime variabler
    //för att kunna öppna de på annat html page samt byter page till tabell.html.
    currentStation = document.getElementById("stationTextBox").value;
    walkTime = document.getElementById("walkTimeBox").value;

    localStorage.setItem("_currentStation", currentStation);
    localStorage.setItem("_walkTime", walkTime);

    sparaData();

    document.location.href = "tabell.html";
}
function goBack(){
    //Funktion för att gå tillbaka till index.html.
    document.location.href = "index.html";
}
