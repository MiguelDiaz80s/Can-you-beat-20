let selectedCountry = "";
let selectedEra = "";
let selectedCompetition = "";
let squad = [];


// ===============================
// COUNTRY DATA
// ===============================

let countries = {};


// Only add Australia if the file loaded correctly
if (typeof australia !== "undefined") {
    countries.Australia = australia;
}


// ===============================
// START GAME
// ===============================

function startGame(mode) {

    document.getElementById("result").innerHTML =
        mode + " cricket selected!";

    document.getElementById("competition").style.display = "block";
}


// ===============================
// CHOOSE COMPETITION
// ===============================

function chooseCompetition(comp) {

    selectedCompetition = comp;

    document.getElementById("competition").style.display = "none";

    document.getElementById("teams").style.display = "block";

    document.getElementById("teamTitle").innerHTML =
        "Choose your " + comp + " team";
}


// ===============================
// PICK COUNTRY / TEAM
// ===============================

function pickTeam(team) {

    selectedCountry = team;

    squad = [];

    document.getElementById("teams").style.display = "none";

    document.getElementById("era").style.display = "block";

    document.getElementById("draftCount").innerHTML =
        "Players: 0/11";

    document.getElementById("teamResult").innerHTML = "";
}


// ===============================
// CHOOSE ERA
// ===============================

function chooseEra(era) {

    selectedEra = era;

    squad = [];

    document.getElementById("era").style.display = "none";

    document.getElementById("draft").style.display = "block";

    document.getElementById("draftCount").innerHTML =
        "Players: 0/11";

    document.getElementById("teamResult").innerHTML = "";

    loadPlayers();
}


// ===============================
// LOAD PLAYERS
// ===============================

function loadPlayers() {

    console.log(
        "Loading players:",
        selectedCountry,
        selectedEra
    );


    // Check country
