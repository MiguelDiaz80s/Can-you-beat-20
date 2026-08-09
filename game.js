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

    // Ensure Teams screen has a Back button to go back to competition
    ensureBackButton("teams", "backFromTeamsBtn", "Back", backFromTeams);
}


// ===============================
// PICK TEAM / COUNTRY
// ===============================

function pickTeam(team) {

    selectedCountry = team;

    squad = [];

    document.getElementById("teams").style.display = "none";

    document.getElementById("era").style.display = "block";

    updateDraftCount();

    document.getElementById("teamResult").innerHTML = "";

    // Add Back button on Era screen to return to Teams
    ensureBackButton("era", "backFromEraBtn", "Back", backFromEra);
}


// ===============================
// CHOOSE ERA
// ===============================

function chooseEra(era) {

    selectedEra = era;

    squad = [];

    document.getElementById("era").style.display = "none";

    document.getElementById("draft").style.display = "block";

    updateDraftCount();

    document.getElementById("teamResult").innerHTML = "";

    // Add Back button on Draft screen to return to Era
    ensureBackButton("draft", "backFromDraftBtn", "Back", backFromDraft);

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

        // Use single quotes around the onclick attribute so JSON.stringify's
        // double-quoted string is safe inside the attribute.
        cards += `

        <div class="card">

            <h3>${player.name}</h3>

            <p>Role: ${player.role}</p>

            <p>Batting: ${player.batting}</p>

            <p>Bowling: ${player.bowling}</p>

            <p>Fielding: ${player.fielding}</p>

            <button onclick='selectPlayer(${JSON.stringify(player.name)})'>
                SELECT
            </button>

        </div>

        `;

    });


    document.getElementById("playerCards").innerHTML = cards;
}


// ===============================
// UPDATE DRAFT COUNTER
// ===============================

function updateDraftCount() {
    const el = document.getElementById("draftCount");
    if (el) {
        el.innerHTML = "Players: " + squad.length + "/11";
    }
}


// ===============================
// SELECT PLAYER
// ===============================

function selectPlayer(name) {

    // Do not allow more than 11
    if (squad.length >= 11) {
        alert("Your XI is already complete!");
        return;
    }

    // Prevent duplicates
    if (squad.some(function(p) { return p === name; })) {
        alert("You already picked this player!");
        return;
    }

    // Add player and update UI
    squad.push(name);

    document.getElementById("teamResult").innerHTML =
        "Squad: " + squad.join(", ");

    // Immediately update the draft counter after a successful pick
    updateDraftCount();

    if (squad.length === 11) {
        alert("Your XI is complete!");
    }
}


// ===============================
// BACK NAVIGATION
// ===============================

function backFromDraft() {
    // Going back from draft to era selection
    squad = [];
    selectedEra = "";

    document.getElementById("draft").style.display = "none";
    document.getElementById("era").style.display = "block";

    // Clear player cards and results
    const pc = document.getElementById("playerCards");
    if (pc) pc.innerHTML = "";
    const tr = document.getElementById("teamResult");
    if (tr) tr.innerHTML = "";

    updateDraftCount();
}

function backFromEra() {
    // Going back from era to team selection
    squad = [];
    selectedEra = "";

    document.getElementById("era").style.display = "none";
    document.getElementById("teams").style.display = "block";

    // Clear draft related UI
    const pc = document.getElementById("playerCards");
    if (pc) pc.innerHTML = "";
    const tr = document.getElementById("teamResult");
    if (tr) tr.innerHTML = "";

    updateDraftCount();

    // Ensure Teams screen has a Back button (in case it was removed)
    ensureBackButton("teams", "backFromTeamsBtn", "Back", backFromTeams);
}

function backFromTeams() {
    // Going back from teams to competition selection
    squad = [];
    selectedCountry = "";
    selectedEra = "";
    selectedCompetition = "";

    document.getElementById("teams").style.display = "none";
    document.getElementById("competition").style.display = "block";

    // Reset UI
    const pc = document.getElementById("playerCards");
    if (pc) pc.innerHTML = "";
    const tr = document.getElementById("teamResult");
    if (tr) tr.innerHTML = "";
    const teamTitle = document.getElementById("teamTitle");
    if (teamTitle) teamTitle.innerHTML = "Choose Country";

    updateDraftCount();
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


    updateDraftCount();

    document.getElementById("teamResult").innerHTML =
        "";


    loadPlayers();
}


// ===============================
// HELPERS
// ===============================

function ensureBackButton(containerId, btnId, label, onClickHandler) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // If button already exists, do nothing
    if (document.getElementById(btnId)) return;

    const btn = document.createElement("button");
    btn.id = btnId;
    btn.className = "back-button";
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", function () {
        try {
            onClickHandler();
        } catch (e) {
            console.error("Back button handler failed:", e);
        }
    });

    // Insert the back button at the top of the container
    container.insertBefore(btn, container.firstChild);
}
