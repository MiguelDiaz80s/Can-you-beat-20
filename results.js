// ==========================================
// CAN YOU BEAT 20 - RESULTS SYSTEM
// ==========================================

const TARGET_WINS = 20;

let currentMatch = 1;
let wins = 0;
let draws = 0;
let losses = 0;
let matchHistory = [];


// ==========================================
// START 20-GAME SEASON (now: run until 20 wins)
// ==========================================

function startSeason() {

    currentMatch = 1;
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


    let match = {

        number: currentMatch,

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
// PLAY NEXT GAME
// ==========================================

function playNextGame() {

    // If we've already reached the target wins, show final results
    if (wins >= TARGET_WINS) {
        showFinalResults();
        return;
    }

    let match = generateMatch();

    showResult(match);

    // If this match reached the target wins, show final results immediately
    if (wins >= TARGET_WINS) {
        showFinalResults();
        return;
    }

    currentMatch++;
}


// ==========================================
// SKIP TO RESULT (play until TARGET_WINS)
// ==========================================

function skipToResult() {

    // Loop until we reach the required wins
    // Add a safety cap to avoid infinite loops
    const SAFETY_CAP = 10000;
    while (wins < TARGET_WINS && matchHistory.length < SAFETY_CAP) {

        generateMatch();

        currentMatch++;

    }

    showFinalResults();
}


// ==========================================
// MATCH SCREEN
// ==========================================

function showMatchScreen() {

    let result = document.getElementById("result");

    if (!result) return;

    result.innerHTML = `

        <div class="card">

            <h2>🏏 Game ${currentMatch} — Wins ${wins}/${TARGET_WINS}</h2>

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
                wins < TARGET_WINS
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

    if (wins >= TARGET_WINS) {

        finalMessage = `
            <h2>🏆 YOU BEAT ${TARGET_WINS}!</h2>
            <p>${wins} wins. ${draws} draws. ${losses} losses.</p>
            <p>${TARGET_WINS} wins achieved in ${totalGames} game${totalGames === 1 ? '' : 's'}.</p>
        `;

    } else {

        finalMessage = `
            <h2>🏏 Season Complete</h2>
            <p>You didn't beat ${TARGET_WINS} this time.</p>
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
