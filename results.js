// ==========================================
// CAN YOU BEAT 20 - 20 GAME RESULTS SYSTEM
// ==========================================

let currentMatch = 1;
let gamesPlayed = 0;

let wins = 0;
let draws = 0;
let losses = 0;

let matchHistory = [];


// ==========================================
// START 20-GAME SEASON
// ==========================================

function startSeason() {

    currentMatch = 1;
    gamesPlayed = 0;

    wins = 0;
    draws = 0;
    losses = 0;

    matchHistory = [];

    showMatchScreen();
}


// ==========================================
// GENERATE ONE MATCH
// ==========================================

function generateMatch() {

    let resultNumber = Math.random();

    let result;

    if (resultNumber < 0.55) {
        result = "WIN";
    } 
    else if (resultNumber < 0.75) {
        result = "DRAW";
    } 
    else {
        result = "LOSS";
    }


    // ======================================
    // OPPONENT
    // ======================================

    let teamName = selectedCountry || "Your Team";

    let opponents = [
        "India",
        "Australia",
        "England",
        "South Africa",
        "New Zealand",
        "Pakistan",
        "Sri Lanka",
        "West Indies"
    ];


    // Remove your own country from opponents
    let possibleOpponents = opponents.filter(function(team) {
        return team !== teamName;
    });


    let opponent =
        possibleOpponents[
            Math.floor(Math.random() * possibleOpponents.length)
        ];


    // ======================================
    // SCORES
    // ======================================

    let yourScore =
        Math.floor(Math.random() * 180) + 220;

    let opponentScore =
        Math.floor(Math.random() * 180) + 200;


    // Make score agree with result
    if (result === "WIN") {

        yourScore = Math.max(
            yourScore,
            opponentScore +
            Math.floor(Math.random() * 40) + 1
        );

    }


    if (result === "LOSS") {

        opponentScore = Math.max(
            opponentScore,
            yourScore +
            Math.floor(Math.random() * 40) + 1
        );

    }


    if (result === "DRAW") {

        opponentScore = yourScore;

    }


    // ======================================
    // UPDATE RECORD
    // ======================================

    gamesPlayed++;

    currentMatch = gamesPlayed + 1;


    if (result === "WIN") {
        wins++;
    }

    if (result === "DRAW") {
        draws++;
    }

    if (result === "LOSS") {
        losses++;
    }


    // ======================================
    // SAVE MATCH
    // ======================================

    let match = {

        number: gamesPlayed,

        team: teamName,

        opponent: opponent,

        result: result,

        yourScore: yourScore,

        opponentScore: opponentScore

    };


    matchHistory.push(match);

    return match;
}


// ==========================================
// PLAY MATCH
// ==========================================
// THIS PLAYS ONE MATCH ONLY
// ==========================================

function playMatch() {

    // If all 20 are already finished
    if (gamesPlayed >= 20) {

        showFinalResults();

        return;
    }


    let match = generateMatch();

    showMatchResult(match);
}


// ==========================================
// SKIP TO END
// ==========================================
// THIS SKIPS ALL REMAINING MATCHES
// AND GOES STRAIGHT TO FINAL RESULTS
// ==========================================

function skipToEnd() {

    while (gamesPlayed < 20) {

        generateMatch();

    }


    showFinalResults();
}


// ==========================================
// MATCH SCREEN
// ==========================================

function showMatchScreen() {

    let result = document.getElementById("result");

    if (!result) return;


    let matchNumber =
        Math.min(gamesPlayed + 1, 20);


    result.innerHTML = `

        <div class="card">

            <h2>🏏 MATCH ${matchNumber}/20</h2>

            <h3>
                ${selectedCountry || "Your Team"}
            </h3>

            <p>
                Your next opponent is waiting...
            </p>

            <br>

            <button onclick="playMatch()">
                ▶ PLAY MATCH
            </button>

            <button onclick="skipToEnd()">
                ⏩ SKIP ALL 20
            </button>

        </div>

    `;
}


// ==========================================
// MATCH RESULT
// ==========================================

function showMatchResult(match) {

    let result = document.getElementById("result");

    if (!result) return;


    let resultEmoji = "🏏";


    if (match.result === "WIN") {
        resultEmoji = "🏆";
    }

    if (match.result === "DRAW") {
        resultEmoji = "🤝";
    }

    if (match.result === "LOSS") {
        resultEmoji = "❌";
    }


    // ======================================
    // MATCH 20
    // ======================================

    if (gamesPlayed >= 20) {

        result.innerHTML = `

            <div class="card">

                <h2>
                    ${resultEmoji}
                    MATCH ${match.number}
                </h2>

                <h3>
                    ${match.team}
                    vs
                    ${match.opponent}
                </h3>

                <h2>
                    ${match.result}
                </h2>

                <p>
                    ${match.team}:
                    <strong>${match.yourScore}</strong>
                </p>

                <p>
                    ${match.opponent}:
                    <strong>${match.opponentScore}</strong>
                </p>

                <hr>

                <p>
                    Record:
                    ${wins} W -
                    ${draws} D -
                    ${losses} L
                </p>

                <br>

                <button onclick="showFinalResults()">
                    🏆 FINAL RESULTS
                </button>

            </div>

        `;

        return;
    }


    // ======================================
    // NORMAL MATCH RESULT
    // ======================================

    result.innerHTML = `

        <div class="card">

            <h2>
                ${resultEmoji}
                MATCH ${match.number}
            </h2>

            <h3>
                ${match.team}
                vs
                ${match.opponent}
            </h3>

            <h2>
                ${match.result}
            </h2>

            <p>
                ${match.team}:
                <strong>${match.yourScore}</strong>
            </p>

            <p>
                ${match.opponent}:
                <strong>${match.opponentScore}</strong>
            </p>

            <hr>

            <p>
                Record:
                ${wins} W -
                ${draws} D -
                ${losses} L
            </p>

            <br>

            <button onclick="playMatch()">
                ▶ NEXT GAME
            </button>

            <button onclick="skipToEnd()">
                ⏩ SKIP ALL 20
            </button>

        </div>

    `;
}


// ==========================================
// FINAL RESULTS
// ==========================================

function showFinalResults() {

    let result = document.getElementById("result");

    if (!result) return;


    let totalGames = matchHistory.length;


    // ======================================
    // FINAL MESSAGE
    // ======================================

    let finalMessage = "";


    if (wins > losses) {

        finalMessage = `
            <h2>🏆 GREAT SEASON!</h2>
            <p>
                You finished the 20-game season
                with more wins than losses.
            </p>
        `;

    }
    else if (wins === losses) {

        finalMessage = `
            <h2>🤝 EVEN SEASON!</h2>
            <p>
                Your wins and losses were equal.
            </p>
        `;

    }
    else {

        finalMessage = `
            <h2>🏏 SEASON COMPLETE!</h2>
            <p>
                The 20 games are finished.
            </p>
        `;

    }


    // ======================================
    // MATCH HISTORY
    // ======================================

    let historyHTML = "";


    matchHistory.forEach(function(match) {

        let emoji = "🏏";


        if (match.result === "WIN") {
            emoji = "🏆";
        }

        if (match.result === "DRAW") {
            emoji = "🤝";
        }

        if (match.result === "LOSS") {
            emoji = "❌";
        }


        historyHTML += `

            <div class="card">

                <h3>
                    ${emoji}
                    Match ${match.number}
                </h3>

                <p>
                    <strong>
                        ${match.team}
                    </strong>

                    ${match.yourScore}

                    -

                    ${match.opponentScore}

                    <strong>
                        ${match.opponent}
                    </strong>
                </p>

                <p>
                    ${match.result}
                </p>

            </div>

        `;

    });


    // ======================================
    // FINAL SCREEN
    // ======================================

    result.innerHTML = `

        <div class="card">

            ${finalMessage}

            <hr>

            <h2>
                📊 FINAL RECORD
            </h2>

            <h3>
                ${wins} - ${draws} - ${losses}
            </h3>

            <p>
                🏆 Wins: ${wins}
            </p>

            <p>
                🤝 Draws: ${draws}
            </p>

            <p>
                ❌ Losses: ${losses}
            </p>

            <p>
                🏏 Total games: ${totalGames}/20
            </p>

        </div>


        <h2>
            📋 MATCH HISTORY
        </h2>

        ${historyHTML}

    `;
}
