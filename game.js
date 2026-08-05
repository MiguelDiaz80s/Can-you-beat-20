let selectedCountry = "";
let selectedEra = "";
let squad = [];


let countries = {
    Australia: australia
};


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

    let players =
    countries[selectedCountry][selectedEra];


    let cards = "";


    players.forEach(function(player){

        cards += `

        <div class="card">

        <h3>${player.name}</h3>

        <p>${player.role}</p>

        <p>Batting: ${player.batting}</p>

        <p>Bowling: ${player.bowling}</p>

        <p>Fielding: ${player.fielding}</p>

        <button onclick="selectPlayer('${player.name}')">
        Select
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


    if(squad.length === 11){

        alert("Your XI is complete!");

    }

}
