﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Sound_Sample_Sampleboard.Controllers
{
    public class SamplerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}