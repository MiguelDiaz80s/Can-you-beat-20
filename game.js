let selectedCountry = "";
let selectedEra = "";
let selectedCompetition = "";
let squad = [];


// ===============================
// COUNTRY DATA
// ===============================

let countries = {};

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
// PICK TEAM / COUNTRY
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

    let country = countries[selectedCountry];

    if (!country) {

        document.getElementById("playerCards").innerHTML =
            "<p>No player data found for " +
            selectedCountry +
            ".</p>";

        console.log(
            "Country not found:",
            selectedCountry
        );

        return;
    }


    let players = country[selectedEra];

    if (!players) {

        document.getElementById("playerCards").innerHTML =
            "<p>No players found for " +
            selectedCountry +
            " in the " +
            selectedEra +
            ".</p>";

        console.log(
            "Era not found:",
            selectedCountry,
            selectedEra
        );

        return;
    }


    let cards = "";


    players.forEach(function(player) {

        cards += `

        <div class="card">

            <h3>${player.name}</h3>

            <p>Role: ${player.role}</p>

            <p>Batting: ${player.batting}</p>

            <p>Bowling: ${player.bowling}</p>

            <p>Fielding: ${player.fielding}</p>

            <button onclick="selectPlayer(${JSON.stringify(player.name)})">
                SELECT
            </button>

        </div>

        `;

    });


    document.getElementById("playerCards").innerHTML = cards;
}


// ===============================
// SELECT PLAYER
// ===============================

function selectPlayer(name) {

    if (squad.length >= 11) {

        alert("Your XI is already complete!");

        return;
    }


    if (squad.includes(name)) {

        alert("You already picked this player!");

        return;
    }


    squad.push(name);


    document.getElementById("teamResult").innerHTML =
        "Squad: " + squad.join(", ");


    document.getElementById("draftCount").innerHTML =
        "Players: " + squad.length + "/11";


    if (squad.length === 11) {

        alert("Your XI is complete!");

    }
}


// ===============================
// RANDOM TEAM + ERA
// ===============================

function randomTeam() {

    let teams = Object.keys(countries);


    if (teams.length === 0) {

        alert("No teams are connected yet.");

        return;
    }


    selectedCountry =
        teams[Math.floor(Math.random() * teams.length)];


    let eras =
        Object.keys(countries[selectedCountry]);


    if (eras.length === 0) {

        alert(
            "No eras found for " +
            selectedCountry
        );

        return;
    }


    selectedEra =
        eras[Math.floor(Math.random() * eras.length)];


    squad = [];


    document.getElementById("teams").style.display =
        "none";

    document.getElementById("era").style.display =
        "none";

    document.getElementById("draft").style.display =
        "block";


    document.getElementById("draftCount").innerHTML =
        "Players: 0/11";

    document.getElementById("teamResult").innerHTML =
        "";


    loadPlayers();
}
