using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Coins_Bank.Model
{
    public class Game
    {
        public GameState NowState { get; private set; }
        public bool GameEnded { get; private set; }
        private Card[][] Table;
        private int WasherX, WasherY;
        private int NowDirect;
        private int HorizDirect;
        private int HowStart;
        private Player[] Players;
        private bool RoundEnden;
        private int Tag = 0;

        public void PlayerReady(int[][] PlayerTable, int NumPlayer)
        {
            var req = new List<int>();
            for (var i = 0; i < 3; ++i)
                for (var j = 0; j < 8; ++j)
                    if (PlayerTable[i][j] != -1)
                        req.Add(PlayerTable[i][j]);
            var Cards = Players[NumPlayer].DropCards(req);
            int yk = 0;
            for (var i = 0; i < 3; ++i)
                for (var j = 0; j < 8; ++j)
                    if (PlayerTable[i][j] != -1)
                        Table[i][j] = Cards[yk++];
            Players[NumPlayer].IsReady = true;
            if (Players[0].IsReady && Players[1].IsReady)
                GoPlay();
        }
        public void Next(int NumPlayer)
        {
            Players[NumPlayer].IsReady = true;
            if (Players[0].IsReady && Players[1].IsReady)
            {
                if (RoundEnden)
                {
                    NewRound();
                    return;
                }
                Players[0].IsReady = Players[1].IsReady = false;
                Tag = Utily.GetTag();
                if (HorizDirect == 1)
                {
                    if (WasherY == 0)
                        WasherY = 1;
                    else
                        WasherY++;
                }
                if (HorizDirect == 3)
                {
                    if (WasherY == 2)
                        WasherY = 1;
                    else
                        WasherY--;
                }
                HorizDirect = -1;
                while (WasherX >= 0 && WasherX < 8 && (Table[WasherY][WasherX] == null || Table[WasherY][WasherX].Direct == NowDirect))
                {
                    if (WasherX == 0 && WasherY != 1)
                    {
                        WasherY = 1;
                        NowDirect = 0;
                    }
                    else if (WasherX == 7 && WasherY != 1)
                    {
                        WasherY = 1;
                        NowDirect = 2;
                    }
                    else if (NowDirect == 0)
                        WasherX++;
                    else
                        WasherX--;
                }
                if (WasherX < 0)
                {
                    Players[1].Gool();
                    RoundEnden = true;
                }
                else if (WasherX > 7)
                {
                    Players[0].Gool();
                    RoundEnden = true;
                }
                else
                {
                    var NewDir = Table[WasherY][WasherX].Direct;
                    Table[WasherY][WasherX].Recive();
                    if (Table[WasherY][WasherX].HP == 0)
                        Table[WasherY][WasherX] = null;
                    if (NewDir == 1 || NewDir == 3)
                        HorizDirect = NewDir;
                    else
                        NowDirect = NewDir;
                }
            }
        }
        public void GoPlay()
        {
            NowState = GameState.Play;
            Players[0].IsReady = Players[1].IsReady = false;
            WasherY = 1;
            if (HowStart == 0)
            {
                WasherX = 0;
                NowDirect = 0;
            }
            else
            {
                WasherX = 7;
                NowDirect = 2;
            }
            HorizDirect = -1;
        }
        public void NewRound()
        {
            RoundEnden = false;
            HowStart = (HowStart + 1) % 2;
            Table = new Card[3][];
            for (int i = 0; i < 3; i++)
            {
                Table[i] = new Card[8];
            }
            Players[0].IsReady = Players[1].IsReady = false;
            Players[0].AddCard(NextCard());
            NowState = GameState.Lay;
        }
        private Card NextCard()
        {
            int HP = Utily.Next() % 5 / 2;
            int dir = Utily.Next() % 4;
            return new Card(dir, HP);
        }
        public Game()
        {
            Players = new Player[2];
            Players[0] = new Player();
            for (int i = 0; i < 9; i++)
            {
                Players[0].AddCard(NextCard());
            }
            Players[1] = new Player();
            for (int i = 0; i < 9; i++)
            {
                Players[1].AddCard(NextCard());
            }
            HowStart = Utily.Next() % 2;
            NewRound();
        }
        public GameInfo Get(int NumPlayer)
        {
            var ans = new GameInfo();
            ans.State = NowState;
            if (HorizDirect == 1 || HorizDirect == 3)
                ans.WasherDirect = HorizDirect;
            else
                ans.WasherDirect = NowDirect;
            ans.NowWasherX = WasherY;
            ans.NowWasherY = WasherX;
            ans.Cards = Players[NumPlayer].GetInfo();
            ans.Result1 = Players[0].Result;
            ans.Result2 = Players[1].Result;
            ans.Tag = Tag;
            return ans;
        }
    }

    public enum GameState
    {
        Lay,
        Play
    }

    public class GameInfo
    {
        public GameState State { get; set; }
        public Card[] Cards { get; set; }
        public int WasherDirect { get; set; }
        public int NowWasherX { get; set; }
        public int NowWasherY { get; set; }
        public int Result1 { get; set; }
        public int Result2 { get; set; }
        public int Tag { get; set; }
    }
}
