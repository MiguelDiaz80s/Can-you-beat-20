#!/usr/bin/env python3
import json, zipfile, urllib.request, collections, os, math

URL="https://cricsheet.org/downloads/all_json.zip"
ZIP="all_json.zip"
OUT="players.js"

urllib.request.urlretrieve(URL, ZIP)

players = collections.defaultdict(lambda: {
    "teams": collections.defaultdict(set),
    "eras": set(), "runs":0, "balls":0, "wickets":0, "bowled_balls":0,
    "catches":0, "stumpings":0, "matches":0, "gender":set()
})

def era(year):
    return f"{(year//10)*10}s"

def clamp(x):
    return max(1, min(99, int(round(x))))

with zipfile.ZipFile(ZIP) as z:
    for n in z.namelist():
        if not n.endswith(".json"):
            continue
        try:
            d=json.loads(z.read(n))
            info=d["info"]
            dates=info.get("dates", [])
            year=int(str(dates[0])[:4]) if dates else int(info.get("season", 2001))
            e=era(year)
            gender=info.get("gender","unknown")
            for team,names in info.get("players", {}).items():
                for name in names:
                    p=players[name]
                    p["teams"][team].add(e)
                    p["eras"].add(e)
                    p["matches"] += 1
                    p["gender"].add(gender)

            for inn in d.get("innings", []):
                for over in inn.get("overs", []):
                    for de in over.get("deliveries", []):
                        batter=de.get("batter")
                        bowler=de.get("bowler")
                        runs=de.get("runs",{})
                        if batter:
                            players[batter]["runs"] += int(runs.get("batter",0))
                            players[batter]["balls"] += 1
                        if bowler:
                            players[bowler]["bowled_balls"] += 1
                        for w in de.get("wickets",[]):
                            out=w.get("player_out")
                            kind=w.get("kind","")
                            if out and kind in {"bowled","caught","lbw","stumped","hit wicket","caught and bowled"}:
                                players[bowler]["wickets"] += 1
                            for f in w.get("fielders",[]) or []:
                                fn=f.get("name") if isinstance(f,dict) else f
                                if fn:
                                    players[fn]["catches"] += 1
                                    if kind=="stumped":
                                        players[fn]["stumpings"] += 1
        except Exception:
            continue

def role(p):
    if p["stumpings"] >= 1:
        return "Wicketkeeper"
    if p["wickets"] >= max(2, p["matches"]//8) and p["wickets"] >= 5:
        if p["runs"] >= 500 and p["wickets"] >= 10:
            return "All-rounder"
        return "Bowler"
    if p["wickets"] >= 5 and p["runs"] >= 300:
        return "All-rounder"
    return "Batter"

def ratings(p):
    batting=clamp(45 + 16*math.log10(1+p["runs"]/1000) + min(28, p["runs"]/800))
    bowling=clamp(35 + 18*math.log10(1+p["wickets"]) + min(38, p["wickets"]*0.9))
    fielding=clamp(60 + min(35, p["catches"]*0.35 + p["stumpings"]*1.5))
    return batting,bowling,fielding

db=collections.defaultdict(list)
for name,p in players.items():
    b,bo,f=ratings(p)
    r=role(p)
    for team,eras in p["teams"].items():
        db[team].append([name,r,b,bo,f,sorted(eras),("female" if p["gender"]=={"female"} else "male")])

legacy = {
"Australia":[
["Don Bradman","Batter",100,5,85,["1930s","1940s"]],["Keith Miller","All-rounder",94,96,93,["1940s","1950s"]],
["Richie Benaud","All-rounder",82,92,90,["1950s","1960s"]],["Bill Lawry","Batter",88,10,85,["1960s"]],
["Greg Chappell","Batter",97,25,92,["1970s","1980s"]],["Dennis Lillee","Bowler",40,99,88,["1970s","1980s"]],
["Jeff Thomson","Bowler",45,97,85,["1970s"]],["Rod Marsh","Wicketkeeper",85,5,96,["1970s","1980s"]],
["Allan Border","Batter",94,30,92,["1980s","1990s"]],["Steve Waugh","Batter",92,75,92,["1990s","2000s"]],
["Mark Waugh","Batter",91,45,94,["1990s","2000s"]],["Shane Warne","Bowler",55,99,90,["1990s","2000s"]],
["Glenn McGrath","Bowler",40,98,90,["1990s","2000s"]],["Adam Gilchrist","Wicketkeeper",96,10,98,["2000s"]],
["Ricky Ponting","Batter",98,20,95,["2000s"]],["Matthew Hayden","Batter",95,15,85,["2000s"]],
["Brett Lee","Bowler",65,96,88,["2000s"]],["Andrew Symonds","All-rounder",88,80,96,["2000s"]]],
"India":[
["Vijay Merchant","Batter",90,5,84,["1930s","1940s"]],["Vinoo Mankad","All-rounder",91,94,88,["1940s","1950s"]],
["Sunil Gavaskar","Batter",98,10,90,["1970s","1980s"]],["Kapil Dev","All-rounder",91,96,94,["1980s"]],
["Dilip Vengsarkar","Batter",88,10,88,["1980s"]],["Sachin Tendulkar","Batter",99,25,94,["1990s","2000s"]],
["Rahul Dravid","Batter",96,5,90,["2000s","2010s"]],["Sourav Ganguly","Batter",92,55,90,["2000s"]],
["Anil Kumble","Bowler",50,97,90,["1990s","2000s"]]],
"England":[
["Wally Hammond","Batter",96,55,88,["1930s","1940s"]],["Len Hutton","Batter",96,10,88,["1940s","1950s"]],
["Fred Trueman","Bowler",45,98,88,["1950s","1960s"]],["Ian Botham","All-rounder",92,96,91,["1970s","1980s"]],
["Graham Gooch","Batter",92,10,86,["1980s","1990s"]],["David Gower","Batter",91,5,88,["1980s","1990s"]]],
"West Indies":[
["George Headley","Batter",98,5,86,["1930s","1940s"]],["Frank Worrell","All-rounder",92,78,94,["1950s","1960s"]],
["Everton Weekes","Batter",96,5,90,["1950s","1960s"]],["Clyde Walcott","Wicketkeeper",95,5,94,["1950s","1960s"]],
["Gary Sobers","All-rounder",100,99,98,["1960s","1970s"]],["Clive Lloyd","Batter",95,35,94,["1970s","1980s"]],
["Viv Richards","Batter",99,35,96,["1970s","1980s"]],["Malcolm Marshall","Bowler",45,99,94,["1980s","1990s"]],
["Brian Lara","Batter",99,10,91,["1990s","2000s"]]],
"South Africa":[
["Graeme Pollock","Batter",98,10,90,["1960s","1970s"]],["Mike Procter","All-rounder",88,96,92,["1960s","1970s"]],
["Clive Rice","All-rounder",90,92,92,["1970s","1980s"]],["Kepler Wessels","Batter",88,5,86,["1980s","1990s"]]],
"New Zealand":[
["Bert Sutcliffe","Batter",90,10,86,["1940s","1950s"]],["John Reid","All-rounder",88,85,88,["1950s","1960s"]],
["Glenn Turner","Batter",90,5,85,["1970s"]],["Richard Hadlee","All-rounder",86,99,96,["1970s","1980s"]],
["Martin Crowe","Batter",95,15,92,["1980s","1990s"]]],
"Pakistan":[
["Hanif Mohammad","Batter",94,10,84,["1950s","1960s"]],["Fazal Mahmood","Bowler",45,95,86,["1950s","1960s"]],
["Imran Khan","All-rounder",88,98,94,["1980s","1990s"]],["Javed Miandad","Batter",96,20,90,["1980s","1990s"]],
["Wasim Akram","Bowler",60,99,94,["1990s","2000s"]],["Waqar Younis","Bowler",50,98,90,["1990s","2000s"]]],
"Sri Lanka":[
["Aravinda de Silva","All-rounder",94,72,92,["1990s"]],["Sanath Jayasuriya","All-rounder",94,82,94,["1990s","2000s"]],
["Muttiah Muralitharan","Bowler",45,100,90,["1990s","2000s","2010s"]],["Chaminda Vaas","Bowler",58,94,91,["1990s","2000s"]]]
}
for team,rows in legacy.items():
    existing={r[0] for r in db[team]}
    for row in rows:
        if row[0] not in existing:
            db[team].append(row)

for team in db:
    for row in db[team]:
        if len(row)==6:
            row.append("male")
    db[team].sort(key=lambda x:x[0].lower())

def js(s):
    return json.dumps(s,ensure_ascii=False,separators=(",",":"))

lines=["// AUTO-GENERATED from Cricsheet all_json.zip.","// Gameplay ratings are derived from observed match production; they are not official ratings.","// Open-data match coverage currently starts in 2001 for men and 2003 for women; curated historical legends are retained above.","const playerDatabase={"]
keys=sorted(db)
for i,team in enumerate(keys):
    lines.append(js(team)+":"+js(db[team])+("," if i<len(keys)-1 else ""))
lines += ["};","function buildPlayer(country,p){return{name:p[0],role:p[1],batting:p[2],bowling:p[3],fielding:p[4],eras:p[5],gender:p[6]||"male",country}}"]
open(OUT,"w",encoding="utf-8").write("\n".join(lines)+"\n")
os.remove(ZIP)
