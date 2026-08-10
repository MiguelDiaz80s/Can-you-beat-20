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

    // Add Restart XI button on Competition screen
    ensureBackButton("competition", "restartXIbtn", "Restart XI", restartXI);
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

    // Add Restart XI button on Teams screen
    ensureBackButton("teams", "restartXIbtn", "Restart XI", restartXI);
}


// ===============================
// PICK TEAM / COUNTRY
// ===============================

function pickTeam(team) {

    selectedCountry = team;

    // Do NOT reset squad when picking a new team - preserve it for multi-selection

    document.getElementById("teams").style.display = "none";

    document.getElementById("era").style.display = "block";

    updateDraftCount();

    document.getElementById("teamResult").innerHTML = "";

    // Add Back button on Era screen to return to Teams
    ensureBackButton("era", "backFromEraBtn", "Back", backFromEra);

    // Add Restart XI button on Era screen
    ensureBackButton("era", "restartXIbtn", "Restart XI", restartXI);
}


// ===============================
// CHOOSE ERA
// ===============================

function chooseEra(era) {

    selectedEra = era;

    // Do NOT reset squad when choosing a new era - preserve it for multi-selection

    document.getElementById("era").style.display = "none";

    document.getElementById("draft").style.display = "block";

    updateDraftCount();

    document.getElementById("teamResult").innerHTML = "";

    // Add Back button on Draft screen to return to Era
    ensureBackButton("draft", "backFromDraftBtn", "Back", backFromDraft);
    // Add Restart XI button to clear current squad when the user wants
    ensureBackButton("draft", "restartXIbtn", "Restart XI", restartXI);

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

        const pc = document.getElementById("playerCards");
        if (pc) pc.innerHTML =
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

        const pc = document.getElementById("playerCards");
        if (pc) pc.innerHTML =
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


    const pc = document.getElementById("playerCards");
    if (!pc) return;

    // Clear existing cards (we recreate them to reflect current squad state)
    pc.innerHTML = "";

    // Create DOM nodes so player names with quotes/apostrophes don't break onclick
    players.forEach(function(player) {
        const card = document.createElement('div');
        card.className = 'card';

        const h3 = document.createElement('h3');
        h3.textContent = player.name;
        card.appendChild(h3);

        const roleP = document.createElement('p');
        roleP.textContent = 'Role: ' + player.role;
        card.appendChild(roleP);

        const batP = document.createElement('p');
        batP.textContent = 'Batting: ' + player.batting;
        card.appendChild(batP);

        const bowlP = document.createElement('p');
        bowlP.textContent = 'Bowling: ' + player.bowling;
        card.appendChild(bowlP);

        const fieldP = document.createElement('p');
        fieldP.textContent = 'Fielding: ' + player.fielding;
        card.appendChild(fieldP);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'SELECT';
        btn.className = 'select-button';
        // Use event listener so names with quotes/apostrophes are safe
        btn.addEventListener('click', function() {
            selectPlayer(player.name);
        });

        // If this player is already in the squad, show as selected and disable button
        if (squad.some(function(p) { return p === player.name; })) {
            btn.disabled = true;
            btn.textContent = 'SELECTED';
        }

        // If XI is already complete, disable all select buttons
        if (squad.length >= 11) {
            btn.disabled = true;
        }

        card.appendChild(btn);

        pc.appendChild(card);
    });
}


// ===============================
// UPDATE DRAFT COUNTER
// ===============================

function updateDraftCount() {
    const el = document.getElementById("draftCount");
    if (el) {
        // Show as X/11 (e.g. 1/11, 2/11 ... 11/11) as requested
        el.innerHTML = squad.length + "/11";
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

    const trEl = document.getElementById("teamResult");
    if (trEl) trEl.innerHTML = "Squad (" + squad.length + "/11): " + squad.join(", ");

    // Immediately update the draft counter after a successful pick
    updateDraftCount();

    // Update player buttons to reflect selected state
    const pc = document.getElementById("playerCards");
    if (pc) {
        const buttons = pc.querySelectorAll('.select-button');
        buttons.forEach(function(b) {
            // Disable the button for the player we just added
            // Match by the card's h3 text
            const card = b.parentElement;
            const nameEl = card ? card.querySelector('h3') : null;
            const playerName = nameEl ? nameEl.textContent : '';
            if (playerName === name) {
                b.disabled = true;
                b.textContent = 'SELECTED';
            }
            // If XI is complete, disable all remaining
            if (squad.length >= 11) {
                b.disabled = true;
            }
        });
    }

    // If XI complete, notify
    if (squad.length === 11) {
        alert("Your XI is complete!");
    }
}


// ===============================
// RESTART XI
// ===============================

function restartXI() {
    // Ask for confirmation before clearing the squad
    if (!confirm("Are you sure you want to restart your XI? All selected players will be removed.")) {
        return;
    }

    // Clear current squad and update UI
    squad = [];

    updateDraftCount();

    const tr = document.getElementById("teamResult");
    if (tr) tr.innerHTML = "";

    // Re-enable all select buttons and reset labels
    const pc = document.getElementById("playerCards");
    if (pc) {
        const buttons = pc.querySelectorAll('.select-button');
        buttons.forEach(function(b) {
            b.disabled = false;
            b.textContent = 'SELECT';
        });
    }
}


// ===============================
// BACK NAVIGATION
// ===============================

function backFromDraft() {
    // Going back from draft to era selection
    // Preserve squad so user's picks aren't lost when navigating back
    selectedEra = "";

    const draftEl = document.getElementById("draft");
    const eraEl = document.getElementById("era");
    if (draftEl) draftEl.style.display = "none";
    if (eraEl) eraEl.style.display = "block";

    // Do NOT clear player cards or teamResult here so the squad is preserved when returning
    updateDraftCount();
}

function backFromEra() {
    // Going back from era to team selection
    // Preserve squad so user's picks aren't lost when navigating back
    selectedEra = "";

    const eraEl = document.getElementById("era");
    const teamsEl = document.getElementById("teams");
    if (eraEl) eraEl.style.display = "none";
    if (teamsEl) teamsEl.style.display = "block";

    // Do NOT clear draft related UI so squad remains when returning
    updateDraftCount();

    // Ensure Teams screen has a Back button (in case it was removed)
    ensureBackButton("teams", "backFromTeamsBtn", "Back", backFromTeams);

    // Ensure Restart XI button on Teams screen
    ensureBackButton("teams", "restartXIbtn", "Restart XI", restartXI);
}

function backFromTeams() {
    // Going back from teams to competition selection
    // Preserve squad so user's picks aren't lost when navigating back
    selectedCountry = "";
    selectedEra = "";
    selectedCompetition = "";

    const teamsEl = document.getElementById("teams");
    const compEl = document.getElementById("competition");
    if (teamsEl) teamsEl.style.display = "none";
    if (compEl) compEl.style.display = "block";

    // Do NOT clear playerCards or teamResult here
    const teamTitle = document.getElementById("teamTitle");
    if (teamTitle) teamTitle.innerHTML = "Choose Country";

    updateDraftCount();

    // Ensure Restart XI button on Competition screen
    ensureBackButton("competition", "restartXIbtn", "Restart XI", restartXI);
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


    // Starting a random team/era resets the squad
    squad = [];


    const teamsEl = document.getElementById("teams");
    const eraEl = document.getElementById("era");
    const draftEl = document.getElementById("draft");
    if (teamsEl) teamsEl.style.display = "none";
    if (eraEl) eraEl.style.display = "none";
    if (draftEl) draftEl.style.display = "block";


    updateDraftCount();

    const tr = document.getElementById("teamResult");
    if (tr) tr.innerHTML = "";

    // Ensure Draft screen has Back button when using Random Team
    ensureBackButton("draft", "backFromDraftBtn", "Back", backFromDraft);
    // Ensure Restart XI button
    ensureBackButton("draft", "restartXIbtn", "Restart XI", restartXI);

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
    // Make sure the button is visible even if the container has custom styles
    btn.style.display = 'inline-block';
    btn.style.marginBottom = '8px';
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
