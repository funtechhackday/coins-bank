using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Coins_Bank.Model
{
    public class Player
    {
        private List<Card> Cards;

        public int CountCards
        {
            get
            {
                return Cards.Count;
            }
        }
        public int Result { get; private set; }
        public bool IsReady { get; set; }

        public void Gool()
        {
            Result++;
        }

        public void AddCard(Card c)
        {
            Cards.Add(c);
        }

        public List<Card> DropCards(List<int> NumCards)
        {
            var ans = new List<Card>(NumCards.Count);
            var lost = new List<Card>();
            int[] usd = new int[CountCards];
            for (var i = 0; i < CountCards; ++i)
                usd[i] = -1;
            for (int i = 0; i < NumCards.Count; i++)
                usd[NumCards[i]] = i;
            for (int i = 0; i < CountCards; i++)
            {
                if (usd[i] != -1)
                    ans[usd[i]] = Cards[i];
                else
                    lost.Add(Cards[i]);
            }
            Cards = lost;
            return ans;
        }

        public Card[] GetInfo()
        {
            var ans = new Card[CountCards];
            for (int i = 0; i < CountCards; i++)
            {
                ans[i] = new Card(Cards[i].Direct, Cards[i].HP);
            }
            return ans;
        }
    }
}
