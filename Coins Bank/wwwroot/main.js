window.onload = init;

function init() {
	info = {
		Table: {
			NickSeats: [],
			Game: {
				State: 0,//0 lay 1 wait 2 play
				YouSeat: 0,
				Cards: [{
					Direct: 0,
					HP: 1
				}],
				WasherDirect: [],
				NowWasherX: -1,
				NowWasherY: -1
			}
		}
	};
	LogInState = {
		NickInput: null,
		PasswordNick: null
	};
	LayState = {
		CardUsde: [],
		Field: [],
		Cards: null,
		FieldCard: [],
		EndTurn: null,
		NowCard: 0
	};
	PlayState = {
		Field: [], 
		Butt: null,
		lastX: null,
		lasty: null		
	}
	MainDiv = document.getElementById("Main");
	NowState = "LogIn";
	BuildLogIn();
	IconName = ["right", "top", "left", "bottom"];
}

function UpDateEvent(){
	var newX = info.Table.Game.NowWasherX;
	var newY = info.Table.Game.NowWasherY;
	if(newX == PlayState.lastX && newY == PlayState.lasty)
		return;
	PlayState.Field[PlayState.lastX][PlayState.lastY].innerHTML="";
	var sp = document.createElement("i");
	sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[info.Table.Game.WasherDirect[newx][newY]]);
	PlayState.Field[newX][newY].innerHTML=`<i class="glyphicon glyphicon-record" 
		aria-hidden="true">
		</i>`;
		PlayState.Field[newX][newY].appendChild(sp);
	PlayState.lastX = newX;
	PlayState.lasty = newY;
	PlayState.onclick = NextEvent;
}

function CardLayEvent(num) {
	var x = (num - num % 8) / 8;
	var y = num % 8;
	var Table = LayState.FieldCard;
	var elem = LayState.Field[x][y];
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 8; j++) {
			if (Table[i][j] == LayState.NowCard && (i != x || j != y))
				Table[i][j] = -1;
		}
	}
	if (Table[x][y] != LayState.NowCard) {
		if(Table[x][y]!=-1)
			LayState.CardUsde[Table[x][y]] = 0;
		Table[x][y] = LayState.NowCard;
		LayState.CardUsde[LayState.NowCard] = 1;
		BuildCardTable(elem, LayState.NowCard);

	}
	else {
		Table[x][y] = -1;
		LayState.CardUsde[LayState.NowCard] = 0;
		BuildCardTable(elem, -1);
	}
}
function NextEvent(){
	PlayState.Butt.onclick = null;
	PlayState.Butt.setAttribute("Class", PlayState.Butt.getAttribute("class") + " disabled");
}
function EntTurnEvent() {
}

function PickCardEvent(num) {
	if(LayState.CardUsde[LayState.NowCard] == 1)
		LayState.Cards.children[LayState.NowCard].setAttribute("class", "btn");
	else
		LayState.Cards.children[LayState.NowCard].setAttribute("class", "btn-primary");	
	LayState.NowCard = num;
	LayState.Cards.children[num].setAttribute("class", "btn-success");
}

function LogInEvent() {

}

function BuildCardTable(elem, num) {
	elem.innerHTML = "";
	if (num != -1) {
		elem.innerText = info.Table.Game.Cards[num].HP;
		var sp = document.createElement("i");
		sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[info.Table.Game.Cards[i].Direct]);
		elem.appendChild(sp);
	}
}

function BuildCards() {
	var CardArr = info.Table.Game.Cards;
	for (var i = 0; i < CardArr.length; i++) {
		var btn = document.createElement("button");
		btn.setAttribute("class", "btn btn-primary");
		btn.setAttribute("type", "button");
		btn.onclick = CreateNiceFun(PickCardEvent, i);
		btn.innerText = CardArr[i].HP;
		var sp = document.createElement("i");
		sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[CardArr[i].Direct]);
		btn.appendChild(sp);
	}
	LayState.NowCard = 0;
}

function BuildLay() {
	NowState = "Lay";
	MainDiv.innerHTML = `<div class = "Score">
    <div id = "blSc" class = "blackScore">
    <p class = "Name" id = "Player1"> Player1</p>
      <p style = "display: inline-block;">1</p>
    </div>
    <div id = "whSc" class = "whiteScore">
      <p id = "Player2" style = "display: inline-block;">2</p> <p class = "Name"> Player2</p></div>
  </div>
  <div class = "Steps">
      <table>
            <tbody>
            <tr id = "tr0">
              <td class= "Vorota"></td>
              <td id = "td0" class="wh">/</td>
              <td id = "td1" class = "bl"></td>
              <td id = "td2" class="wh"></td>
              <td id = "td3" class = "bl"></td>
              <td id = "td4" class="wh"></td>
              <td id = "td5" class = "bl"></td>
              <td id = "td6" class="wh"></td>
              <td id = "td7" class = "bl">\</td>
              <td  class= "Vorota"></td>
            </tr>
            <tr id="tr1">
              <td class= "Vorota VorotaActive"></td>
              <td id = "td8" class = "bl"></td>
              <td id = "td9" class="wh"></td>
              <td id = "td10" class = "bl"></td>
              <td id = "td11" class="wh"></td>
              <td id = "td12" class = "bl"></td>
              <td id = "td13" class="wh"></td>
              <td id = "td14" class = "bl"></td>
              <td id = "td15" class="wh"></td>
              <td class= "Vorota VorotaActive"></td>
            </tr>
              <tr id ="tr2">
                <td class= "Vorota"></td>
                <td id = "td16" class="wh">\</td>
                <td id = "td17" class = "bl"></td>
                <td id = "td18" class="wh"></td>
                <td id = "td19" class = "bl"></td>
                <td id = "td20" class="wh"></td>
                <td id = "td21" class = "bl"></td>
                <td id = "td22" class="wh"></td>
                <td id = "td23" class = "bl">/</td>
                <td class= "Vorota"></td>
              </tr>
              </tbody>
            </table>
      </div>
      <div class = "Cart">
        <div class="btn-group" id="Cards">
        </div>
		<button type="button" class="btn btn-info" id="EndTurn">Закончить ход</button>
      </div>`;
	LayState.Field = [[], [], []];
	LayState.FieldCard = [[], [], []];
	for (var i = 0; i < 24; ++i) {
		var elem = document.getElementById("td" + i);
		var x = (i - i % 8) / 8;
		var y = i % 8;
		LayState.Field[x][y] = elem;
		if (info.Table.Game.YouSeat == (x + y + 1) % 2 && (x != 0 || y != 0) && (x != 2 || y != 0) && (x != 0 || y != 7) && (x != 2 || y != 7)) {
			elem.setAttribute("class", elem.getAttribute("class") + " PointActive");
			elem.onclick = CreateNiceFun(CardLayEvent, i);
		}
		LayState.FieldCard[x][y] = -1;
	}
	LayState.Cards = document.getElementById("Cards");
	LayState.EndTurn = document.getElementById("EndTurn");
	LayState.EndTurn.onclick = EndTurnEvent;
}
function BuildPlay(){
	NowState = "Play";
	MainDiv.innerHTML = `
      <div class = "Score">
    <div id = "blSc" class = "blackScore">
    <p class = "Name"> Player1</p>
      <p style = "display: inline-block;">1</p>
    </div>
    <div id = "whSc" class = "whiteScore">
      <p style = "display: inline-block;">2</p> <p class = "Name"> Player2</p></div>
  </div> <div class = "Steps Play">
      <table>
            <tbody>
            <tr id = "tr0">
              <td class= "Vorota Shibe"><i class="glyphicon glyphicon-record" aria-hidden="true"></i></td>
              <td id = "td0" class="wh"> </td>
              <td id = "td1" class = "bl"></td>
              <td id = "td2" class="wh"></td>
              <td id = "td3" class = "bl"></td>
              <td id = "td4" class="wh"></td>
              <td id = "td5" class = "bl"></td>
              <td id = "td6" class="wh"></td>
              <td id = "td7" class = "bl"></td>
              <td  class= "Vorota"></td>
            </tr>
            <tr id="tr1">
              <td class= "Vorota VorotaActive"></td>
              <td id = "td8" class = "bl"></td>
              <td id = "td9" class="wh"></td>
              <td id = "td10" class = "bl"></td>
              <td id = "td11" class="wh"></td>
              <td id = "td12" class = "bl"></td>
              <td id = "td13" class="wh"></td>
              <td id = "td14" class = "bl"></td>
              <td id = "td15" class="wh"></td>
              <td class= "Vorota VorotaActive"></td>
            </tr>
              <tr id ="tr2">
                <td class= "Vorota"></td>
                <td id = "td16" class="wh"></td>
                <td id = "td17" class = "bl"></td>
                <td id = "td18" class="wh"></td>
                <td id = "td19" class = "bl"></td>
                <td id = "td20" class="wh"></td>
                <td id = "td21" class = "bl"></td>
                <td id = "td22" class="wh"></td>
                <td id = "td23" class = "bl"></td>
                <td class= "Vorota"></td>
              </tr>
              </tbody>
          </table>
      </div>
      <div class = "Cart">
        <button id = "NextEvent" type="button" class="btn btn-success btn-block" onclick	= "NextEvent">Далее</button>
      </div>`;
    PlayState.Butt = document.getElementById("NextEvent");
    PlayState.Field = [[], [], []];
	for (var i = 0; i < 24; ++i) {
		var elem = document.getElementById("td" + i);
		var x = (i - i % 8) / 8;
		var y = i % 8;
		PlayState.Field[x][y] = elem;
	}
	
}

function BuildLogIn() {
	NowState = "LogIn";
	MainDiv.innerHTML = `
      <div class="Centr">
        <form>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" placeholder="Name" id="NickInp">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" placeholder="Password" id="PasssInp">
        </div>
        <button type="button" class="btn btn-success" id="LogInBtn">Submit</button>
        <form>
      </div>
  `;
	LogInState.NickInput = document.getElementById("NickInp");
	LogInState.PasswordNick = document.getElementById("PassInp");
	var btn = document.getElementById("LogInBtn");
	btn.onclick = LogInEvent;
}

function CreateNiceFun(CallBack, par) {
	var hlp = function (inp) {
		var num = inp;
		return function () {
			CallBack(num);
		}
	}
	return hlp(par);
}

function MyDiv(x, y) {
	return (x - x % y) / y;
}