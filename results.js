// ==========================================
// CAN YOU BEAT 20 - RESULTS SYSTEM
// ==========================================

let currentMatch = 1; // next match number shown (gamesPlayed + 1)
let gamesPlayed = 0;   // counts every game played (wins/draws/losses)
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
// GENERATE A MATCH
// ==========================================

function generateMatch() {

    let resultNumber = Math.random();

    let result;

    if (resultNumber < 0.55) {
        result = "WIN";
    } else if (resultNumber < 0.75) {
        result = "DRAW";
    } else {
        result = "LOSS";
    }


    if (result === "WIN") {
        wins++;
    }

    if (result === "DRAW") {
        draws++;
    }

    if (result === "LOSS") {
        losses++;
    }


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


    let opponent =
        opponents[Math.floor(Math.random() * opponents.length)];


    // Don't play yourself
    if (opponent === teamName) {
        opponent =
            opponents[Math.floor(Math.random() * opponents.length)];
    }


    let yourScore =
        Math.floor(Math.random() * 180) + 220;

    let opponentScore =
        Math.floor(Math.random() * 180) + 200;


    if (result === "WIN") {

        yourScore = Math.max(
            yourScore,
            opponentScore + Math.floor(Math.random() * 40) + 1
        );

    }


    if (result === "LOSS") {

        opponentScore = Math.max(
            opponentScore,
            yourScore + Math.floor(Math.random() * 40) + 1
        );

    }


    if (result === "DRAW") {

        opponentScore = yourScore;

    }


    // Increment gamesPlayed so every result counts as a game
    gamesPlayed++;

    let match = {

        number: gamesPlayed,

        team: teamName,

        opponent: opponent,

        result: result,

        yourScore: yourScore,

        opponentScore: opponentScore

    };


    matchHistory.push(match);

    // Update next match number
    currentMatch = gamesPlayed + 1;

    return match;
}


// ==========================================
// PLAY NEXT GAME
// ==========================================

function playNextGame() {

    // If we've already played 20 games, show final results
    if (gamesPlayed >= 20) {
        showFinalResults();
        return;
    }

    let match = generateMatch();

    showResult(match);
}


// ==========================================
// SKIP TO RESULT
// ==========================================

function skipToResult() {

    // Play until we've completed 20 games
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

    // next match number is gamesPlayed + 1
    const nextMatchNumber = Math.min(gamesPlayed + 1, 20);

    result.innerHTML = `

        <div class="card">

            <h2>🏏 Game ${nextMatchNumber}/20</h2>

            <p>
                ${selectedCountry || "Your Team"}
                vs
                Your next opponent
            </p>

            <br>

            <button onclick="playNextGame()">
                ▶ Play Next Game
            </button>

            <button onclick="skipToResult()">
                ⏭ Skip to Result
            </button>

        </div>

    `;
}


// ==========================================
// MATCH RESULT
// ==========================================

function showResult(match) {

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


    result.innerHTML = `

        <div class="card">

            <h2>${resultEmoji} Game ${match.number}</h2>

            <h3>
                ${match.team}
                vs
                ${match.opponent}
            </h3>

            <h2>${match.result}</h2>

            <p>
                ${match.team}:
                ${match.yourScore}
            </p>

            <p>
                ${match.opponent}:
                ${match.opponentScore}
            </p>

            <hr>

            <p>
                Record:
                ${wins} W -
                ${draws} D -
                ${losses} L
            </p>

            ${
                gamesPlayed < 20
                ? `
                    <button onclick="playNextGame()">
                        ▶ Play Next Game
                    </button>

                    <button onclick="skipToResult()">
                        ⏭ Skip to Result
                    </button>
                `
                : `
                    <button onclick="showFinalResults()">
                        🏆 Final Results
                    </button>
                `
            }

        </div>

    `;
}


// ==========================================
// FINAL RESULTS
// ==========================================

function showFinalResults() {

    let result = document.getElementById("result");

    if (!result) return;


    const totalGames = matchHistory.length;

    let finalMessage = "";


    if (
        wins === 20 &&
        draws === 0 &&
        losses === 0
    ) {

        finalMessage = `
            <h2>🏆 YOU BEAT 20!</h2>
            <p>20 wins. 0 draws. 0 losses.</p>
            <p>UNBEATEN.</p>
        `;

    } else {

        finalMessage = `
            <h2>🏏 Season Complete</h2>
            <p>You didn't beat 20 this time.</p>
        `;

    }


    let historyHTML = "";


    matchHistory.forEach(function(match) {

        historyHTML += `

            <div class="card">

                <h3>
                    Game ${match.number}
                </h3>

                <p>
                    ${match.team}
                    ${match.yourScore}
                    -
                    ${match.opponentScore}
                    ${match.opponent}
                </p>

                <strong>
                    ${match.result}
                </strong>

            </div>

        `;

    });


    result.innerHTML = `

        <div class="card">

            ${finalMessage}

            <hr>

            <h2>📊 Final Record</h2>

            <p>
                Wins: ${wins}
            </p>

            <p>
                Draws: ${draws}
            </p>

            <p>
                Losses: ${losses}
            </p>

            <p>
                Total games: ${totalGames}
            </p>

            <h2>
                ${wins}-${draws}-${losses}
            </h2>

        </div>

        <h2>📋 Match History</h2>

        ${historyHTML}

    `;
}
