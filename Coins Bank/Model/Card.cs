using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Coins_Bank.Model
{
    public class Card
    {
        public int HP { get; private set; }
        public int Direct { get; private set; }
        public void Recive()
        {
            --HP;
        }
        public Card(int dir, int hp)
        {
            HP = hp;
            Direct = dir;
        }
    }
}
