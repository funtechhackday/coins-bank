﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Coins_Bank.Controllers
{
    public class apiController : Controller
    {
        static Model.Server Server;
        static bool WasBuild = false;

        [HttpPost]
        public void Next([FromBody] NickInfo info)
        {
            Server.Next(info.Nick);
        }

        [HttpPost]
        public void Ready([FromBody] ReadyInfo info)
        {
            Server.Ready(info.Nick, info.Table);
        }

        [HttpGet]
        public Model.ServerInfo Get(string Nick)
        {
            if (!WasBuild)
                Server = new Model.Server();
            WasBuild = true;
            return Server.Get(Nick);
        }
    }

    public class NickInfo
    {
        public string Nick { get; set; }
    }

    public class ReadyInfo
    {
        public string Nick { get; set; }
        public int[][] Table { get; set; }
    }
}
