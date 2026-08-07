let selectedCountry = "";
let selectedEra = "";
let squad = [];


let countries = {
    Australia: australia
};

alert("game.js loaded");

function startGame(mode){

    document.getElementById("result").innerHTML =
    mode + " cricket selected!";

    document.getElementById("competition").style.display = "block";

}


function chooseCompetition(comp){

    document.getElementById("competition").style.display = "none";

    document.getElementById("teams").style.display = "block";

    document.getElementById("teamTitle").innerHTML =
    "Choose your " + comp + " team";

}


function pickTeam(team){

    selectedCountry = team;

    document.getElementById("teams").style.display = "none";

    document.getElementById("era").style.display = "block";

}


function chooseEra(era){

    selectedEra = era;

    document.getElementById("era").style.display = "none";

    document.getElementById("draft").style.display = "block";

    loadPlayers();

}



function loadPlayers(){

    alert("Loading " + selectedCountry + " " + selectedEra);
    
    console.log("Loading:", selectedCountry, selectedEra);

    let players = countries[selectedCountry]?.[selectedEra];


    if(!players){

        alert(
        "No players found for " 
        + selectedCountry 
        + " " 
        + selectedEra
        );

        console.log(countries);

        return;

    }


    let cards = "";


    players.forEach(function(player){


        cards += `

        <div class="card">

        <h3>${player.name}</h3>

        <p>Role: ${player.role}</p>

        <p>Batting: ${player.batting}</p>

        <p>Bowling: ${player.bowling}</p>

        <p>Fielding: ${player.fielding}</p>

        <button onclick="selectPlayer('${player.name}')">
        SELECT
        </button>

        </div>

        `;


    });


    document.getElementById("playerCards").innerHTML = cards;

}



function selectPlayer(name){


    if(squad.includes(name)){

        alert("You already picked this player!");

        return;

    }


    squad.push(name);


    document.getElementById("teamResult").innerHTML =
    "Squad: " + squad.join(", ");


    document.getElementById("draftCount").innerHTML =
    "Players: " + squad.length + "/11";


    if(squad.length === 11){

        alert("Your XI is complete!");

    }

}
function randomTeam(){

    let teams = Object.keys(countries);

    selectedCountry = teams[Math.floor(Math.random() * teams.length)];

    let eras = Object.keys(countries[selectedCountry]);

    selectedEra = eras[Math.floor(Math.random() * eras.length)];


    document.getElementById("teams").style.display = "none";
    document.getElementById("era").style.display = "none";
    document.getElementById("draft").style.display = "block";


    loadPlayers();

}
