let selectedMode="",selectedCompetition="",selectedTeam="",selectedCountry="",selectedEra="";
let gameMode="",challengeMode=false;
let squad=[],currentMatch=1,currentStreak=0,bestStreak=0,careerWins=0,careerLosses=0,careerDraws=0,history=[];
let draftSaves={};
const ERA_LIST=["1900s","1910s","1920s","1930s","1940s","1950s","1960s","1970s","1980s","1990s","2000s","2010s","2020s"];

function getAvailableEras(){
  if(selectedCompetition==="BBL") return ["2010s","2020s"];
  if(selectedCompetition==="IPL") return ["2000s","2010s","2020s"];
  return ERA_LIST;
}

function modeGender(){
  return selectedMode==="Womens" ? "female" : "male";
}

function linkStoredPlayers(){
  // Bring the historical player files in /players into the live database.
  // They are loaded before game.js, so this keeps the game connected to the
  // stored historical data instead of leaving those players inaccessible.
  if(typeof australia!=="undefined" && selectedMode==="Mens"){
    const existing=playerDatabase["Australia"]||[];
    const seen=new Set(existing.map(p=>p[0]));
    Object.entries(australia).forEach(([era,players])=>{
      players.forEach(p=>{
        if(!seen.has(p.name)){
          existing.push([p.name,p.role,p.batting,p.bowling,p.fielding,[era]]);
          seen.add(p.name);
        }else{
          const item=existing.find(x=>x[0]===p.name);
          if(item && !item[5].includes(era)) item[5].push(era);
        }
      });
    });
    playerDatabase["Australia"]=existing;
  }
}

function databaseTeams(){
  if(typeof playerDatabase==="undefined") return [];
  const gender=modeGender();
  return Object.keys(playerDatabase)
    .filter(team=>playerDatabase[team].some(player=>(player[6]||"male")===gender))
    .sort((a,b)=>a.localeCompare(b));
}
const $=id=>document.getElementById(id);

function init(){
  const modeButtons=document.querySelectorAll("#modeButtons [data-game-mode]");
  modeButtons.forEach(button=>{
    button.addEventListener("click",()=>selectGameMode(button.dataset.gameMode));
  });
  const genderButtons=document.querySelectorAll("#gender [data-gender]");
  genderButtons.forEach(button=>{
    button.addEventListener("click",()=>selectGender(button.dataset.gender));
  });
  const challengeToggle=$("challengeToggle");
  if(challengeToggle){
    challengeToggle.checked=challengeMode;
    challengeToggle.addEventListener("change",()=>{
      challengeMode=challengeToggle.checked;
      updateChallengeUI();
      renderDraft();
    });
  }

  const reset=$("resetGameBtn");
  if(reset) reset.addEventListener("click",resetAll);

  document.querySelectorAll(".back-btn").forEach(button=>{
    button.addEventListener("click",()=>show(button.dataset.back));
  });

  renderCompetitions();
  renderEras();
  updateHome();
}

function show(id){
  document.querySelectorAll(".screen").forEach(screen=>screen.classList.add("hidden"));
  const target=$(id);
  if(target) target.classList.remove("hidden");
  window.scrollTo(0,0);
}

function selectGameMode(mode){
  gameMode=mode;
  show("gender");
}

function selectGender(gender){
  selectedMode=gender;
  linkStoredPlayers();
  if(gameMode==="FreePlay"){
    selectedCompetition="WORLD";
    const back=$("teams")?.querySelector(".back-btn");
    if(back) back.dataset.back="gender";
    renderTeams();
    show("teams");
  }else{
    renderCompetitions();
    show("competition");
  }
}

function updateChallengeUI(){
  const toggle=$("challengeToggle");
  const description=$("challengeDescription");
  if(toggle) toggle.checked=challengeMode;
  if(description) description.textContent=challengeMode?"Player stats hidden":"Player stats visible";
  document.body.classList.toggle("challenge-on",challengeMode);
}

function renderCompetitions(){
  const box=$("competitionButtons");
  if(!box||typeof competitionData==="undefined") return;
  box.innerHTML=Object.entries(competitionData).map(([key,value])=>
    '<button type="button" class="competition-button" data-competition="'+key+'">'+value.label+"</button>"
  ).join("");
  box.querySelectorAll("[data-competition]").forEach(button=>{
    button.addEventListener("click",()=>chooseCompetition(button.dataset.competition));
  });
}

function chooseCompetition(c){
  selectedCompetition=c;
  const back=$("teams")?.querySelector(".back-btn");
  if(back) back.dataset.back="competition";
  if(gameMode==="RealGame"){
    randomizeRealGame(c);
    return;
  }
  renderTeams();
  show("teams");
}

function randomizeRealGame(competition){
  const data=typeof competitionData!=="undefined"?competitionData[competition]:null;
  if(!data) return;
  const teams=competition==="WORLD"?databaseTeams():data.teams.slice();
  if(!teams.length) return;
  selectedTeam=teams[Math.floor(Math.random()*teams.length)];
  selectedCountry=(typeof teamData!=="undefined"?teamData[selectedTeam]?.pool:null)||selectedTeam;
  const eras=getAvailableEras();
  selectedEra=eras[Math.floor(Math.random()*eras.length)];
  squad=[];
  renderDraft();
  show("draft");
}

function renderTeams(){
  const data=typeof competitionData!=="undefined"?competitionData[selectedCompetition]:null;
  if(!data) return;
  const teams=selectedCompetition==="WORLD"?databaseTeams():data.teams.slice();
  $("teamTitle").textContent=selectedCompetition==="WORLD"?"Worldwide cricket teams":"Choose your team";
  const box=$("teamButtons");
  const searchWrap=selectedCompetition==="WORLD"
    ? '<div class="card team-search-card"><input id="teamSearch" class="team-search" type="search" placeholder="🔎 Search any team..." autocomplete="off"></div>'
    : "";
  box.innerHTML=searchWrap+'<div id="teamButtonList" class="button-grid-inner"></div>';
  const list=$("teamButtonList");
  const draw=(term="")=>{
    const q=term.trim().toLowerCase();
    const filtered=q?teams.filter(team=>team.toLowerCase().includes(q)):teams;
    list.innerHTML=filtered.map(team=>
      '<button type="button" class="team-button" data-team="'+encodeURIComponent(team)+'">'+teamEmoji(team)+" "+team+"</button>"
    ).join("");
    list.querySelectorAll("[data-team]").forEach(button=>{
      button.addEventListener("click",()=>pickTeam(decodeURIComponent(button.dataset.team)));
    });
  };
  draw();
  const search=$("teamSearch");
  if(search) search.addEventListener("input",()=>draw(search.value));
  $("randomTeamBtn").onclick=()=>randomizeTeamAndEra(teams);
}

function teamEmoji(team){
  const country=typeof teamData!=="undefined"?teamData[team]?.country:"";
  return country==="Australia"?"🇦🇺":country==="India"?"🇮🇳":country==="England"?"🏴":country==="South Africa"?"🇿🇦":country==="New Zealand"?"🇳🇿":country==="Pakistan"?"🇵🇰":country==="Sri Lanka"?"🇱🇰":country==="West Indies"?"🏝️":"🏏";
}

function pickTeam(team){
  selectedTeam=team;
  selectedCountry=(typeof teamData!=="undefined"?teamData[team]?.pool:null)||team;
  show("era");
}
function randomizeTeamAndEra(teams){
  const button=$("randomTeamBtn"), panel=$("randomizer");
  if(!button||!panel||!teams.length||button.dataset.busy==="1") return;

  button.dataset.busy="1";
  button.disabled=true;
  panel.classList.remove("hidden");
  $("randomizerLabel").textContent="RANDOM TEAM";
  $("randomizerStatus").textContent="🎰 Rolling through teams...";
  $("randomSlotValue").textContent="🎲";

  const team=teams[Math.floor(Math.random()*teams.length)];

  spinSlot(teams,team,1050).then(()=>{
    selectedTeam=team;
    selectedCountry=(typeof teamData!=="undefined"?teamData[team]?.pool:null)||team;
    $("randomizerStatus").textContent="✅ Team locked: "+team;
    $("randomizerLabel").textContent="TEAM SELECTED";
    $("randomSlotValue").textContent=team;

    setTimeout(()=>{
      $("randomizerLabel").textContent="RANDOM ERA";
      $("randomizerStatus").textContent="🎰 Spinning through eras...";
      $("randomSlotValue").textContent="🎲";

      const eras=getAvailableEras();
      const era=eras[Math.floor(Math.random()*eras.length)];
      spinSlot(eras,era,1150).then(()=>{
        selectedEra=era;
        squad=[];
        $("randomizerStatus").textContent="✅ Era locked: "+era;
        $("randomizerLabel").textContent="ERA SELECTED";
        $("randomSlotValue").textContent=era;

        setTimeout(()=>{
          button.disabled=false;
          button.dataset.busy="0";
          chooseEra(era);
        },650);
      });
    },750);
  });
}

function spinSlot(items,finalValue,duration){
  return new Promise(resolve=>{
    const value=$("randomSlotValue");
    const start=performance.now();
    let lastIndex=-1;

    function tick(now){
      const elapsed=now-start;
      const progress=Math.min(1,elapsed/duration);
      const eased=1-Math.pow(1-progress,3);
      const step=Math.max(55,Math.floor(150-eased*95));

      if(elapsed>=duration){
        value.textContent=finalValue;
        value.classList.remove("slot-spinning");
        void value.offsetWidth;
        value.classList.add("slot-land");
        setTimeout(()=>{value.classList.remove("slot-land");resolve()},260);
        return;
      }

      const index=Math.floor((elapsed/step))%items.length;
      if(index!==lastIndex){
        value.textContent=items[index];
        lastIndex=index;
      }
      value.classList.add("slot-spinning");
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

function renderEras(){
  const box=$("eraButtons");
  if(!box) return;
  box.innerHTML=getAvailableEras().map(era=>
    '<button type="button" class="era-button" data-era="'+era+'">'+era+"</button>"
  ).join("");
  box.querySelectorAll("[data-era]").forEach(button=>{
    button.addEventListener("click",()=>chooseEra(button.dataset.era));
  });
}

function chooseEra(era){
  selectedEra=era;
  squad=[];
  renderDraft();
  show("draft");
}

function getPool(){
  if(typeof playerDatabase==="undefined") return [];
  const raw=playerDatabase[selectedCountry]||[];
  const gender=modeGender();
  const exact=raw.filter(player=>player[5].includes(selectedEra) && (player[6]||"male")===gender);
  let pool=exact.slice();

  const isClubPool=[...Object.keys(typeof teamData!=="undefined"?teamData:{}), "Adelaide Strikers","Brisbane Heat","Hobart Hurricanes","Melbourne Renegades","Melbourne Stars","Perth Scorchers","Sydney Sixers","Sydney Thunder"].includes(selectedCountry) && selectedCountry!==selectedTeam ? true : ["Adelaide Strikers","Brisbane Heat","Hobart Hurricanes","Melbourne Renegades","Melbourne Stars","Perth Scorchers","Sydney Sixers","Sydney Thunder"].includes(selectedCountry);

  if(!isClubPool && pool.length<14){
    raw.slice().sort((a,b)=>distanceToEra(a)-distanceToEra(b)).forEach(player=>{
      if(!pool.includes(player)) pool.push(player);
    });
  }

  return pool.map(player=>buildPlayer(selectedCountry,player));
}

function distanceToEra(player){
  const index=ERA_LIST.indexOf(selectedEra);
  return Math.min(...player[5].map(era=>Math.abs(ERA_LIST.indexOf(era)-index)));
}

function renderDraft(){
  const pool=getPool();
  const selected=new Set(squad.map(player=>player.name));
  $("draftTeam").textContent=selectedTeam+" • "+selectedMode;
  $("draftEra").textContent=selectedEra;
  const search=$("playerSearch");
  const term=search?search.value.trim().toLowerCase():"";
  const visiblePool=term?pool.filter(player=>player.name.toLowerCase().includes(term)):pool;
  $("playerCards").innerHTML=visiblePool.map((player,index)=>{
    const stats=challengeMode
      ? '<div class="hidden-stats">🔒 Stats hidden in Challenge Mode</div>'
      : '<div class="ratings"><span>BAT<b>'+player.batting+'</b></span><span>BOWL<b>'+player.bowling+'</b></span><span>FIELD<b>'+player.fielding+'</b></span></div>';
    return '<div class="card player-card"><div class="role">'+player.role+'</div><h3>'+player.name+'</h3>'+stats+'<button type="button" class="select-button" data-player-index="'+index+'" '+(selected.has(player.name)?"disabled":"")+'>' +(selected.has(player.name)?"SELECTED":"SELECT")+"</button></div>";
  }).join("");
  $("playerCards").querySelectorAll("[data-player-index]").forEach(button=>{
    button.addEventListener("click",()=>selectPlayer(visiblePool[Number(button.dataset.playerIndex)]?.name));
  });
  $("draftCount").textContent=squad.length+"/11";
  $("selectedPlayers").innerHTML=squad.length
    ? '<b>Your XI</b><div class="selected-list">'+squad.map((player,index)=>'<span class="pill">'+(index+1)+". "+player.name+"</span>").join("")+"</div>"
    : '<b>Your XI</b><p class="muted">Pick 11 players and balance the roles.</p>';
  const bowl=squad.filter(player=>player.role==="Bowler").length;
  const wk=squad.filter(player=>player.role==="Wicketkeeper").length;
  $("roleWarning").textContent=squad.length===11?(bowl<3?"⚠️ Consider 3+ bowlers.":wk<1?"⚠️ No wicketkeeper selected.":"✅ XI ready."):"";
  $("startChallengeBtn").classList.toggle("hidden",squad.length!==11);
  $("startChallengeBtn").textContent=challengeMode?"🔥 Start 20-match challenge":"🏏 Start game";
  $("startChallengeBtn").onclick=startChallenge;
  if(search && !search.dataset.bound){
    search.dataset.bound="1";
    search.addEventListener("input",()=>renderDraft());
  }
}

function rollNextNormalPick(){
  linkStoredPlayers();
  const teams=databaseTeams();
  if(!teams.length) return;
  const team=teams[Math.floor(Math.random()*teams.length)];
  selectedTeam=team;
  selectedCountry=(typeof teamData!=="undefined"?teamData[team]?.pool:null)||team;
  const eras=getAvailableEras();
  selectedEra=eras[Math.floor(Math.random()*eras.length)];
}

function selectPlayer(name){
  const player=getPool().find(item=>item.name===name);
  if(!player||squad.length>=11||squad.some(item=>item.name===name)) return;
  squad.push(player);

  // In normal mode, every pick rolls a completely new team and era for
  // the next player. Challenge Mode keeps the original team/era fixed.
  if(!challengeMode && squad.length<11) rollNextNormalPick();

  renderDraft();
}

function startChallenge(){
  currentMatch=1;
  currentStreak=0;
  history=[];
  showMatchScreen();
}

function difficulty(){return Math.min(.16,(currentMatch-1)*.012)}

function squadStrength(){
  if(!squad.length) return 50;
  const bat=squad.reduce((sum,player)=>sum+player.batting,0)/squad.length;
  const bowl=squad.reduce((sum,player)=>sum+player.bowling,0)/squad.length;
  const field=squad.reduce((sum,player)=>sum+player.fielding,0)/squad.length;
  const wk=squad.some(player=>player.role==="Wicketkeeper")?4:-4;
  const balance=(squad.filter(player=>player.role==="Bowler").length>=3?3:0)+(squad.filter(player=>player.role==="Batter").length>=4?3:0);
  return bat*.4+bowl*.4+field*.2+wk+balance;
}

function opponentName(){
  const all=["Australia","India","England","South Africa","New Zealand","Pakistan","Sri Lanka","West Indies"];
  const possible=all.filter(country=>country!==selectedCountry);
  return possible[Math.floor(Math.random()*possible.length)];
}

function showMatchScreen(){
  show("match");
  const pct=Math.min(100,currentStreak/20*100);
  const opp=opponentName();
  $("matchPanel").innerHTML='<div class="card"><div class="match-top"><div><div class="eyebrow">20-MATCH CHALLENGE</div><h2>Match '+currentMatch+'/20</h2></div><strong>🔥 '+currentStreak+'/20</strong></div><div class="progress"><div style="width:'+pct+'%"></div></div></div><div class="card scoreboard"><div><small>'+selectedTeam+'</small><div class="score">XI</div></div><div class="vs">VS</div><div><small>'+opp+'</small><div class="score">🏏</div></div></div><div class="card"><h3>Match plan</h3><p class="muted">XI strength: <b>'+Math.round(squadStrength())+'</b>. The challenge gets harder as the streak grows.</p><div class="match-actions"><button type="button" class="gold" id="playMatchBtn">▶ PLAY</button><button type="button" id="showSquadBtn">👥 XI</button></div><button type="button" class="wide" id="quickSimBtn">⏩ Quick simulate</button></div>';
  $("playMatchBtn").onclick=playMatch;
  $("showSquadBtn").onclick=showSquad;
  $("quickSimBtn").onclick=quickSim;
}

function showSquad(){renderDraft();show("draft")}

function playMatch(){
  const opp=opponentName(),strength=squadStrength();
  const base=.58+(strength-75)/180-difficulty()+(selectedCompetition==="Test"?.02:0);
  const roll=Math.random();
  let result=roll<Math.max(.25,Math.min(.9,base))?"WIN":roll<.96?"LOSS":"DRAW";
  if(result==="DRAW"&&selectedCompetition!=="Test") result="LOSS";
  const your=Math.max(80,Math.floor(190+Math.random()*150+(strength-75)*1.2));
  const oppScore=result==="WIN"?Math.max(70,your-Math.floor(8+Math.random()*65)):result==="LOSS"?your+Math.floor(5+Math.random()*65):your;
  history.push({n:currentMatch,opp,result,your,oppScore});
  if(result==="WIN"){currentStreak++;careerWins++}else if(result==="LOSS"){currentStreak=0;careerLosses++}else careerDraws++;
  bestStreak=Math.max(bestStreak,currentStreak);
  updateHome();
  renderResult(history[history.length-1]);
}

function quickSim(){playMatch()}

function renderResult(match){
  const win=match.result==="WIN",draw=match.result==="DRAW",cls=win?"result-win":draw?"result-draw":"result-loss",margin=Math.abs(match.your-match.oppScore);
  $("matchPanel").innerHTML='<div class="card '+cls+'"><div class="eyebrow">MATCH '+match.n+'</div><h2>'+(win?"🏆 YOU WIN!":draw?"🤝 DRAW":"❌ DEFEAT")+'</h2><div class="scoreboard"><div><small>'+selectedTeam+'</small><div class="score">'+match.your+'</div></div><div class="vs">-</div><div><small>'+match.opp+'</small><div class="score">'+match.oppScore+'</div></div></div><p><b>'+(win?"Won by ":"Lost by ")+margin+" runs</b></p></div><div class="card"><h3>🔥 Streak: '+currentStreak+'/20</h3><p class="muted">Best: '+bestStreak+' • Career wins: '+careerWins+' • Losses: '+careerLosses+'</p><button type="button" class="gold wide" id="resultMainBtn">'+(win&&currentStreak>=20?"🏆 YOU BEAT 20!":match.result==="LOSS"?"🔄 Try again":"▶ Next match")+"</button><button type="button" class="wide" id="historyBtn">📋 Match history</button></div>';
  $("resultMainBtn").onclick=win&&currentStreak>=20?champion:match.result==="LOSS"?restartChallenge:nextMatch;
  $("historyBtn").onclick=viewHistory;
}

function nextMatch(){if(currentStreak>=20) champion(); else {currentMatch++;showMatchScreen()}}
function restartChallenge(){currentMatch=1;currentStreak=0;history=[];showMatchScreen()}
function champion(){
  $("matchPanel").innerHTML='<div class="card result-win" style="text-align:center"><div class="trophy">🏆</div><h2>YOU BEAT 20!</h2><p>You completed the 20-match streak.</p><button type="button" class="gold wide" id="runBackBtn">Run it back</button><button type="button" class="wide" id="newXIBtn">New XI</button></div>';
  $("runBackBtn").onclick=restartChallenge;
  $("newXIBtn").onclick=resetAll;
}
function viewHistory(){
  const rows=history.map(match=>'<div class="history-row"><span>Match '+match.n+' • '+match.opp+'</span><b>'+match.result+' '+match.your+'-'+match.oppScore+'</b></div>').join("");
  $("matchPanel").insertAdjacentHTML("beforeend",'<div class="card history"><h3>📋 History</h3>'+rows+"</div>");
}
function resetAll(){
  selectedMode=selectedCompetition=selectedTeam=selectedCountry=selectedEra="";
  gameMode="";
  squad=[];currentMatch=1;currentStreak=0;history=[];draftSaves={};
  try{ localStorage.removeItem("cyb20Drafts"); }catch(error){}
  show("home");updateHome();updateChallengeUI();
}
function updateHome(){
  $("homeStreak").textContent=currentStreak;
  $("homeBest").textContent=bestStreak;
  $("homeWins").textContent=careerWins;
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
else init();

// Start the game after every script and DOM element has loaded.
if(document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
