let selectedTeam = "";
let selectedEra = "";
let randomMode = false;
let squad = [];


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

selectedTeam = team;
randomMode = false;

document.getElementById("teams").style.display = "none";

document.getElementById("era").style.display = "block";

document.getElementById("teamResult").innerHTML =
team + " selected!";

}


function chooseEra(era){

selectedEra = era;

document.getElementById("era").style.display = "none";

document.getElementById("draft").style.display = "block";

loadDraftPlayers();

}


function randomTeam(){

randomMode = true;

document.getElementById("teams").style.display = "none";

document.getElementById("draft").style.display = "block";

loadDraftPlayers();

}


function loadDraftPlayers(){

let availablePlayers = [];


if(randomMode === false){

availablePlayers = players[selectedTeam][selectedEra];

}

else {

for(let country in players){

for(let era in players[country]){

availablePlayers =
availablePlayers.concat(players[country][era]);

}

}

}


let cards = "";


availablePlayers.forEach(function(player){

cards += `

<div class="card">

<h3>${player.name}</h3>

<p>${player.role}</p>

<p>Batting: ${player.batting}</p>

<p>Bowling: ${player.bowling}</p>

<p>Fielding: ${player.fielding}</p>

<button onclick='draftPlayer(${JSON.stringify(player)})'>
SELECT
</button>

</div>

`;

});


document.getElementById("playerCards").innerHTML = cards;

}


function draftPlayer(player){

if(squad.length >= 11){

alert("Your team is full!");

return;

}


squad.push(player);


document.getElementById("draftCount").innerHTML =
"Players: " + squad.length + "/11";

}
