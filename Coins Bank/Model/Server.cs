using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Coins_Bank.Model
{
    public class Server
    {
        private Game NowGame;
        public Server()
        {
            NowGame = new Game();
        }
        public ServerInfo Get(string nick)
        {
            var info = new ServerInfo();
            info.Table = new TableInfo();
            info.Table.NickSeats = new string[2];
            info.Table.NickSeats[0] = "Player1";
            info.Table.NickSeats[1] = "Player2";
            if (nick == "Player1")
            {
                info.Table.YouSeat = 0;
                info.Table.Game = NowGame.Get(0);
            }
            else
            {
                info.Table.YouSeat = 1;
                info.Table.Game = NowGame.Get(1);
            }
            return info;
        }

        public void Next(string nick)
        {
            if (nick == "Player1")
                NowGame.Next(0);
            else
                NowGame.Next(1);
        }
        public void Ready(string nick, int[][] Table)
        {
            if (nick == "Player1")
                NowGame.PlayerReady(Table, 0);
            else
                NowGame.PlayerReady(Table, 1);
        }
    }

    public class TableInfo
    {
        public string[] NickSeats { get; set; }
        public int YouSeat { get; set; }
        public GameInfo Game { get; set; }
    }

    public class ServerInfo
    {
        public TableInfo Table { get; set; }
    }
}
