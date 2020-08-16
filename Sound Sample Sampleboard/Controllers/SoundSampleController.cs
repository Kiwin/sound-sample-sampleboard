using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Sound_Sample_Sampleboard.Controllers
{
    public class SoundSampleController : Controller
    {
        static JsonResult availableSoundFilePaths;

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult AvailableSounds()
        {
            if (availableSoundFilePaths == null)
            {
                string[] filePaths = System.IO.Directory.GetFiles(@"./wwwroot/sounds/", "*.ogg");

                for (int i = 0; i < filePaths.Length; i++)
                {
                    string fileName = filePaths[i];
                    filePaths[i] = fileName.Replace("./wwwroot/", "./");
                }
                availableSoundFilePaths = Json(filePaths);
            }
            return availableSoundFilePaths;
        }
    }
}