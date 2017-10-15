window.onload = init;

$.post = function (url, data, CallBack, dataType) {
	return jQuery.ajax({
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/' + dataType
		},
		'type': 'POST',
		'url': url,
		'data': JSON.stringify(data),
		'dataType': dataType,
		'success': CallBack
	});
};

$.get = function (url, data, CallBack) {
	return jQuery.ajax({
		'type': 'GET',
		'url': url,
		'data': data,
		'response': 'xml',
		'success': CallBack
	});
};

function init() {
	info = {
		Table: {
			NickSeats: [],
			YouSeat: 0,
			Game: {
				State: 0,//0 lay 1 wait 2 play
				Cards: [{
					Direct: 0,
					HP: 1
				}],
				WasherDirect: 0,
				NowWasherX: -1,
				NowWasherY: -1,
				Result1: 0,
				Result2: 0,
				Tag: 0
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
		lastX: -2,
		lasty: null,
		LastTag: -1,
		LeftVor: null,
		RightVor: null
	};
	MainDiv = document.getElementById("Main");
	NowState = "LogIn";
	BuildLogIn();
	IconName = ["right", "top", "left", "bottom"];
	PlayerNick = "";
}

function DrowShibe() {
    if (info.Table.Game.State != 2)
        return;
    var newX = info.Table.Game.NowWasherX;
    var newY = info.Table.Game.NowWasherY;
    
    if (PlayState.lastX != -1) {
        PlayState.Field[PlayState.lastX][PlayState.lastY].innerHTML = "";
    } else {
        PlayState.lastX = newX;
        PlayState.lastY = newY;
        PlayState.Field[PlayState.lastX][PlayState.lastY].innerHTML = `<i class="glyphicon glyphicon-record" 
		aria-hidden="true">
		</i>`;
        return;
    }
    if (PlayState.lastyY != newY) {
        PlayState.Field[PlayState.lastX][newY].innerHTML = `<i class="glyphicon glyphicon-record" 
		aria-hidden="true">
		</i>`;
        if (PlayState.lastX == newX) {
            var sp = document.createElement("i");
            sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[info.Table.Game.WasherDirect]);
            PlayState.Field[newX][newY].appendChild(sp); 
        }
        PlayState.lastY = newY;
    } else {
        if (newX - PlayState.lastX > 0) {
            PlayState.lastX++;
            if (PlayState.lastX < 8) {
                PlayState.Field[PlayState.lastX][PlayState.lastY].innerHTML = `<i class="glyphicon glyphicon-record" 
		aria-hidden="true">
		</i>`;
                if (PlayState.lastX == newX) {
                    var sp = document.createElement("i");
                    sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[info.Table.Game.WasherDirect]);
                    PlayState.Field[newX][newY].appendChild(sp);

                }
            } else {
                PlayState.RightVor.innerHTML = `<i class="glyphicon glyphicon-record"
		aria-hidden="true">
		</i>`;
                PlayState.RightVor.setAttribute("class", "Vorota VorotaActive Shibe");
            }
        } else {
            PlayState.lastX--;
            if (PlayState.lastX >= 0) {
                PlayState.Field[PlayState.lastX][PlayState.lastY].innerHTML = `<i class="glyphicon glyphicon-record" 
		aria-hidden="true">
		</i>`;
                if (PlayState.lastX == newX) {
                    var sp = document.createElement("i");
                    sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[info.Table.Game.WasherDirect]);
                    PlayState.Field[newX][newY].appendChild(sp);

                }
            } else {
                PlayState.LeftVor.innerHTML = `<i class="glyphicon glyphicon-record"
		aria-hidden="true">
		</i>`;
                PlayState.LeftVor.setAttribute("class", "Vorota VorotaActive Shibe");
            }
        }
    }
}

function UpDateEvent() {
   
    var newX = info.Table.Game.NowWasherX;
    var newY = info.Table.Game.NowWasherY;
    
    while (newX != PlayState.lastX && newY != PlayState.lastY)
        setTimeout(DrowShibe, 100);
    /*
    PlayState.LastTag = info.Table.Game.Tag;
    PlayState.Butt.onclick = NextEvent;
    PlayState.Butt.setAttribute("class", "btn btn-success btn-block");
	tim = null;
	PlayState.Butt.setAttribute("class", "btn btn-success btn-block");
	var res = document.getElementById("Res1");
	res.innerText = info.Table.Game.Result1;
	res = document.getElementById("Res2");
	res.innerText = info.Table.Game.Result2;*/
}

function CardLayEvent(num) {
	var x = (num - num % 8) / 8;
	var y = num % 8;
	var Table = LayState.FieldCard;
	var elem = LayState.Field[x][y];
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 8; j++) {
            if (Table[i][j] == LayState.NowCard && (i != x || j != y)) {
                Table[i][j] = -1;
                BuildCardTable(LayState.Field[i][j], -1);
            }
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

function NextEvent() {
	PlayState.Butt.onclick = null;
	PlayState.Butt.setAttribute("Class", PlayState.Butt.getAttribute("class") + " disabled");
	$.post('./api/Next', {
		Nick: PlayerNick
	}, function () { }, 'json');
}

function EndTurnEvent() {
    LayState.EndTurn.setAttribute("style", "display:none;");
    LayState.Cards.setAttribute("style", "display:none");
	$.post('./api/Ready', {
		Nick: PlayerNick,
		Table: LayState.FieldCard
    }, function () { }, 'json');
    
}

function PickCardEvent(num) {
	if(LayState.CardUsde[LayState.NowCard] == 1)
		LayState.Cards.children[LayState.NowCard].setAttribute("class", "btn btn-basic");
	else
		LayState.Cards.children[LayState.NowCard].setAttribute("class", "btn btn-primary");	
	LayState.NowCard = num;
	LayState.Cards.children[num].setAttribute("class", "btn btn-success");
}

function LogInEvent() {
	PlayerNick = LogInState.NickInput.value;
	tim = setInterval(UpDate, 1000);
}

function UpDateCallBack(NewInfo) {
	info = NewInfo;
	if (info.Table.Game.State == 1 && NowState != "Play")
		BuildPlay();
	else if (info.Table.Game.State == 0 && NowState != "Lay")
		BuildLay();
	if (NowState == "Play")
		UpDateEvent();
}

function UpDate() {
	$.get('./api/Get', {
		Nick: PlayerNick
	}, UpDateCallBack);
}

function BuildCardTable(elem, num) {
	elem.innerHTML = "";
	if (num != -1) {
		elem.innerText = info.Table.Game.Cards[num].HP;
		var sp = document.createElement("i");
		sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[info.Table.Game.Cards[num].Direct]);
		elem.appendChild(sp);
	}
}

function BuildCards() {
	var CardArr = info.Table.Game.Cards;
	LayState.CardUsde = [];
	for (var i = 0; i < CardArr.length; i++) {
		LayState.CardUsde[i] = 0;
		var btn = document.createElement("button");
		if (i != 0)
			btn.setAttribute("class", "btn btn-primary");
		else
			btn.setAttribute("class", "btn btn-success");
		btn.setAttribute("type", "button");
		btn.onclick = CreateNiceFun(PickCardEvent, i);
		btn.innerText = CardArr[i].HP;
		var sp = document.createElement("i");
		sp.setAttribute("class", "glyphicon glyphicon-triangle-" + IconName[CardArr[i].Direct]);
		btn.appendChild(sp);
		LayState.Cards.appendChild(btn);
	}
	LayState.NowCard = 0;	
}

function BuildLay() {
	NowState = "Lay";
	MainDiv.innerHTML = `<div class = "Score">
    <div id = "blSc" class = "blackScore">
    <p class = "Name" id = "Player1"> Player1</p>
      <p style = "display: inline-block;" id="Res1">1</p>
    </div>
    <div id = "whSc" class = "whiteScore">
      <p id = "Player2" style = "display: inline-block;" id="Res2">2</p> <p class = "Name"> Player2</p></div>
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
              <td id = "td7" class = "bl">\\</td>
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
                <td id = "td16" class="wh">\\</td>
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
		if (info.Table.YouSeat == (x + y + 1) % 2 && (x != 0 || y != 0) && (x != 2 || y != 0) && (x != 0 || y != 7) && (x != 2 || y != 7)) {
			elem.setAttribute("class", elem.getAttribute("class") + " PointActive");
			elem.onclick = CreateNiceFun(CardLayEvent, i);
		}
		LayState.FieldCard[x][y] = -1;
	}
	LayState.Cards = document.getElementById("Cards");
	LayState.EndTurn = document.getElementById("EndTurn");
	LayState.EndTurn.onclick = EndTurnEvent;
	var res = document.getElementById("Res1");
	res.innerText = info.Table.Game.Result1;
	res = document.getElementById("Player2");
	res.innerText = info.Table.Game.Result2;
	BuildCards();
}

function BuildPlay() {
	NowState = "Play";
	MainDiv.innerHTML = `
      <div class = "Score">
    <div id = "blSc" class = "blackScore">
    <p class = "Name"> Player1</p>
      <p style = "display: inline-block;" id="Res1">1</p>
    </div>
    <div id = "whSc" class = "whiteScore">
      <p style = "display: inline-block;" id="Res2">2</p> <p class = "Name"> Player2</p></div>
  </div> <div class = "Steps Play">
      <table>
            <tbody>
            <tr id = "tr0">
              <td class= "Vorota"></td>
              <td id = "td0" class="wh"> </td>
              <td id = "td1" class = "bl"></td>
              <td id = "td2" class="wh"></td>
              <td id = "td3" class = "bl"></td>
              <td id = "td4" class="wh"></td>
              <td id = "td5" class = "bl"></td>
              <td id = "td6" class="wh"></td>
              <td id = "td7" class = "bl"></td>
              <td class= "Vorota"></td>
            </tr>
            <tr id="tr1">
              <td class= "Vorota VorotaActive" id="LftVor"></td>
              <td id = "td8" class = "bl"></td>
              <td id = "td9" class="wh"></td>
              <td id = "td10" class = "bl"></td>
              <td id = "td11" class="wh"></td>
              <td id = "td12" class = "bl"></td>
              <td id = "td13" class="wh"></td>
              <td id = "td14" class = "bl"></td>
              <td id = "td15" class="wh"></td>
              <td class= "Vorota VorotaActive" id="RghtVor"></td>
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
        <button id = "NextEvent" type="button" class="btn btn-success btn-block" onclick="NextEvent">Далее</button>
      </div>`;
    PlayState.Butt = document.getElementById("NextEvent");
    PlayState.Field = [[], [], []];
	for (var i = 0; i < 24; ++i) {
		var elem = document.getElementById("td" + i);
		var x = (i - i % 8) / 8;
		var y = i % 8;
		PlayState.Field[x][y] = elem;
	}
	PlayState.LastTag = -1;
	PlayState.lastX = -1;
	PlayState.lastY = -1;
	PlayState.LeftVor = document.getElementById("LftVor");
	PlayState.RightVor = document.getElementById("RghtVor");
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
		};
	};
	return hlp(par);
}

function MyDiv(x, y) {
	return (x - x % y) / y;
}