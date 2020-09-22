using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace dotnetReactTask.Models
{
    public class Mission
    {
        public string MissionDesc { get; set; }
        public string File { get; set; }
    }

}