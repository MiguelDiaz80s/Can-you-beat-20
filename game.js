let selectedCountry = "";
let selectedEra = "";
let selectedCompetition = "";
let squad = [];

let wins = 0;
let losses = 0;
let currentMatch = 1;

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

    ensureBackButton(
        "competition",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );
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

    ensureBackButton(
        "teams",
        "backFromTeamsBtn",
        "Back",
        backFromTeams
    );

    ensureBackButton(
        "teams",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );
}

// ===============================
// PICK TEAM
// ===============================

function pickTeam(team) {
    selectedCountry = team;

    document.getElementById("teams").style.display = "none";
    document.getElementById("era").style.display = "block";

    updateDraftCount();

    document.getElementById("teamResult").innerHTML = "";

    ensureBackButton(
        "era",
        "backFromEraBtn",
        "Back",
        backFromEra
    );

    ensureBackButton(
        "era",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );
}

// ===============================
// CHOOSE ERA
// ===============================

function chooseEra(era) {
    selectedEra = era;

    document.getElementById("era").style.display = "none";
    document.getElementById("draft").style.display = "block";

    updateDraftCount();

    document.getElementById("teamResult").innerHTML = "";

    ensureBackButton(
        "draft",
        "backFromDraftBtn",
        "Back",
        backFromDraft
    );

    ensureBackButton(
        "draft",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );

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

        if (pc) {
            pc.innerHTML =
                "<p>No player data found for " +
                selectedCountry +
                ".</p>";
        }

        return;
    }

    let players = country[selectedEra];

    if (!players) {

        const pc = document.getElementById("playerCards");

        if (pc) {
            pc.innerHTML =
                "<p>No players found for " +
                selectedCountry +
                " in the " +
                selectedEra +
                ".</p>";
        }

        return;
    }

    const pc = document.getElementById("playerCards");

    if (!pc) return;

    pc.innerHTML = "";

    players.forEach(function(player) {

        const card = document.createElement("div");
        card.className = "card";

        const h3 = document.createElement("h3");
        h3.textContent = player.name;
        card.appendChild(h3);

        const roleP = document.createElement("p");
        roleP.textContent = "Role: " + player.role;
        card.appendChild(roleP);

        const batP = document.createElement("p");
        batP.textContent = "Batting: " + player.batting;
        card.appendChild(batP);

        const bowlP = document.createElement("p");
        bowlP.textContent = "Bowling: " + player.bowling;
        card.appendChild(bowlP);

        const fieldP = document.createElement("p");
        fieldP.textContent = "Fielding: " + player.fielding;
        card.appendChild(fieldP);

        const btn = document.createElement("button");

        btn.type = "button";
        btn.textContent = "SELECT";
        btn.className = "select-button";

        btn.addEventListener("click", function() {
            selectPlayer(player.name);
        });

        if (
            squad.some(function(p) {
                return p === player.name;
            })
        ) {
            btn.disabled = true;
            btn.textContent = "SELECTED";
        }

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
        el.innerHTML = squad.length + "/11";
    }
}

// ===============================
// SELECT PLAYER
// ===============================

function selectPlayer(name) {
    if (squad.length >= 11) {
        alert("Your XI is already complete!");
        return;
    }

    if (
        squad.some(function(p) {
            return p === name;
        })
    ) {
        alert("You already picked this player!");
        return;
    }

    squad.push(name);

    const trEl = document.getElementById("teamResult");

    if (trEl) {
        trEl.innerHTML =
            "Squad (" +
            squad.length +
            "/11): " +
            squad.join(", ");
    }

    updateDraftCount();

    const pc = document.getElementById("playerCards");

    if (pc) {

        const buttons =
            pc.querySelectorAll(".select-button");

        buttons.forEach(function(b) {

            const card = b.parentElement;

            const nameEl =
                card ?
                card.querySelector("h3") :
                null;

            const playerName =
                nameEl ?
                nameEl.textContent :
                "";

            if (playerName === name) {

                b.disabled = true;
                b.textContent = "SELECTED";
            }

            if (squad.length >= 11) {
                b.disabled = true;
            }
        });
    }

    // ===============================
    // XI COMPLETE
    // ===============================

    if (squad.length === 11) {
        showMatchScreen();
    }
}

// ===============================
// MATCH SCREEN
// ===============================

function showMatchScreen() {
    const draft = document.getElementById("draft");

    if (draft) {
        draft.style.display = "none";
    }

    let oldResults =
        document.getElementById("matchResults");

    if (oldResults) {
        oldResults.remove();
    }

    const results = document.createElement("div");

    results.id = "matchResults";

    results.className = "card";


    results.innerHTML = `

        <h2>🏏 MATCH ${currentMatch}</h2>

        <h3>
        ${selectedCountry}
        </h3>

        <p>
        ${selectedCompetition}
        </p>

        <p>
        Your XI is ready.
        </p>

        <p>
        ${wins} wins • ${losses} losses
        </p>

        <button id="skipResultsButton">
            SKIP TO RESULTS
        </button>

        <br><br>

        <button id="backToSquadButton">
            BACK TO SQUAD
        </button>

    `;


    document.body.appendChild(results);


    document
        .getElementById("skipResultsButton")
        .addEventListener(
            "click",
            function() {
                showMatchResult();
            }
        );


    document
        .getElementById("backToSquadButton")
        .addEventListener(
            "click",
            function() {

                results.remove();

                if (draft) {
                    draft.style.display = "block";
                }

            }
        );
}

// ===============================
// MATCH RESULT
// ===============================

function showMatchResult() {
    const results =
        document.getElementById("matchResults");

    if (!results) return;


    // Random match result
    const won =
        Math.random() < 0.70;


    let yourRuns;
    let opponentRuns;


    if (won) {

        yourRuns =
            Math.floor(
                Math.random() * 100
            ) + 140;

        opponentRuns =
            Math.floor(
                Math.random() * 100
            ) + 70;

        if (opponentRuns >= yourRuns) {
            opponentRuns = yourRuns - 8;
        }

        wins++;

    } else {

        opponentRuns =
            Math.floor(
                Math.random() * 100
            ) + 140;

        yourRuns =
            Math.floor(
                Math.random() * 100
            ) + 70;

        if (yourRuns >= opponentRuns) {
            yourRuns = opponentRuns - 8;
        }

        losses++;
    }


    const margin =
        Math.abs(
            yourRuns -
            opponentRuns
        );


    let resultText;

    if (won) {

        resultText =
            "🏆 YOU WIN!";

    } else {

        resultText =
            "❌ YOU LOSE!";
    }


    results.innerHTML = `

        <h2>${resultText}</h2>

        <h3>
        ${selectedCountry}
        ${yourRuns}/${Math.floor(Math.random() * 4)}
        </h3>

        <h3>
        Opponent
        ${opponentRuns}/${Math.floor(Math.random() * 10)}
        </h3>

        <p>
        ${won
            ? "Won by " + margin + " runs"
            : "Lost by " + margin + " runs"}
        </p>

        <hr>

        <h3>
        🏆 Wins: ${wins}
        </h3>

        <h3>
        ❌ Losses: ${losses}
        </h3>

        <h3>
        Progress: ${wins}/20 wins
        </h3>

        <br>

        ${
            won && wins >= 20
            ?
            `<button id="championButton">
                🏆 YOU BEAT 20!
            </button>`
            :
            `<button id="nextMatchButton">
                NEXT MATCH
            </button>
            <br><br>
            <button id="changeTeamButton">
                CHANGE TEAM
            </button>`
        }

    `;


    if (won && wins >= 20) {

        document
            .getElementById("championButton")
            .addEventListener(
                "click",
                function() {

                    alert(
                        "🏆 YOU BEAT 20 MATCHES!"
                    );

                }
            );

    } else {

        document
            .getElementById("nextMatchButton")
            .addEventListener(
                "click",
                function() {

                    currentMatch++;

                    showMatchScreen();

                }
            );


        document
            .getElementById("changeTeamButton")
            .addEventListener(
                "click",
                function() {

                    results.remove();

                    squad = [];

                    updateDraftCount();

                    document.getElementById(
                        "teams"
                    ).style.display = "block";

                    document.getElementById(
                        "draft"
                    ).style.display = "none";

                    document.getElementById(
                        "era"
                    ).style.display = "none";

                    ensureBackButton(
                        "teams",
                        "backFromTeamsBtn",
                        "Back",
                        backFromTeams
                    );

                }
            );
    }
}

// ===============================
// RESTART XI
// ===============================

function restartXI() {
    if (
        !confirm(
            "Are you sure you want to restart your XI? All selected players will be removed."
        )
    ) {
        return;
    }

    squad = [];

    updateDraftCount();

    const tr =
        document.getElementById("teamResult");

    if (tr) {
        tr.innerHTML = "";
    }

    const pc =
        document.getElementById("playerCards");

    if (pc) {

        const buttons =
            pc.querySelectorAll(".select-button");

        buttons.forEach(function(b) {

            b.disabled = false;
            b.textContent = "SELECT";

        });
    }

    const results =
        document.getElementById("matchResults");

    if (results) {
        results.remove();
    }

    const draft =
        document.getElementById("draft");

    if (draft) {
        draft.style.display = "block";
    }
}

// ===============================
// BACK NAVIGATION
// ===============================

function backFromDraft() {
    selectedEra = "";

    const draftEl =
        document.getElementById("draft");

    const eraEl =
        document.getElementById("era");

    if (draftEl) {
        draftEl.style.display = "none";
    }

    if (eraEl) {
        eraEl.style.display = "block";
    }

    updateDraftCount();
}

function backFromEra() {
    selectedEra = "";

    const eraEl =
        document.getElementById("era");

    const teamsEl =
        document.getElementById("teams");

    if (eraEl) {
        eraEl.style.display = "none";
    }

    if (teamsEl) {
        teamsEl.style.display = "block";
    }

    updateDraftCount();

    ensureBackButton(
        "teams",
        "backFromTeamsBtn",
        "Back",
        backFromTeams
    );

    ensureBackButton(
        "teams",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );
}

function backFromTeams() {
    selectedCountry = "";
    selectedEra = "";
    selectedCompetition = "";

    const teamsEl =
        document.getElementById("teams");

    const compEl =
        document.getElementById("competition");

    if (teamsEl) {
        teamsEl.style.display = "none";
    }

    if (compEl) {
        compEl.style.display = "block";
    }

    const teamTitle =
        document.getElementById("teamTitle");

    if (teamTitle) {
        teamTitle.innerHTML =
            "Choose Country";
    }

    updateDraftCount();

    ensureBackButton(
        "competition",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );
}

// ===============================
// RANDOM TEAM
// ===============================

function randomTeam() {
    let teams =
        Object.keys(countries);


    if (teams.length === 0) {

        alert(
            "No teams are connected yet."
        );

        return;
    }


    selectedCountry =
        teams[
            Math.floor(
                Math.random() *
                teams.length
            )
        ];


    let eras =
        Object.keys(
            countries[selectedCountry]
        );


    if (eras.length === 0) {

        alert(
            "No eras found for " +
            selectedCountry
        );

        return;
    }


    selectedEra =
        eras[
            Math.floor(
                Math.random() *
                eras.length
            )
        ];


    squad = [];

    const teamsEl =
        document.getElementById("teams");

    const eraEl =
        document.getElementById("era");

    const draftEl =
        document.getElementById("draft");


    if (teamsEl) {
        teamsEl.style.display = "none";
    }

    if (eraEl) {
        eraEl.style.display = "none";
    }

    if (draftEl) {
        draftEl.style.display = "block";
    }


    updateDraftCount();


    const tr =
        document.getElementById("teamResult");

    if (tr) {
        tr.innerHTML = "";
    }


    ensureBackButton(
        "draft",
        "backFromDraftBtn",
        "Back",
        backFromDraft
    );

    ensureBackButton(
        "draft",
        "restartXIbtn",
        "Restart XI",
        restartXI
    );


    loadPlayers();
}

// ===============================
// HELPER: BACK BUTTON
// ===============================

function ensureBackButton(
    containerId,
    btnId,
    label,
    onClickHandler
) {
    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;


    if (
        document.getElementById(
            btnId
        )
    ) {
        return;
    }


    const btn =
        document.createElement(
            "button"
        );


    btn.id = btnId;

    btn.className =
        "back-button";

    btn.type =
        "button";

    btn.textContent =
        label;

    btn.style.display =
        "inline-block";

    btn.style.marginBottom =
        "8px";


    btn.addEventListener(
        "click",
        function() {

            try {

                onClickHandler();

            } catch (e) {

                console.error(
                    "Button failed:",
                    e
                );

            }

        }
    );


    container.insertBefore(
        btn,
        container.firstChild
    );
}
