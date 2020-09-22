using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetReactTask.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http; 
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace dotnetReactTask.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MissionController : ControllerBase
    {
        private IMemoryCache _cache;

        public MissionController(IMemoryCache memoryCache) {
            _cache = memoryCache;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Mission> Get()
        {
            var cacheMissionsList = _cache.GetOrCreate("MissionsList", entry => {
                entry.SetPriority(CacheItemPriority.NeverRemove);
                return new List<Mission>();
            });
            return cacheMissionsList;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<Mission> GetMyMissions()
        {
            var missionsListStr = HttpContext.Session.GetString("MissionsList");
            return getListFromSerializedMissionsList(missionsListStr);
        }

        [HttpPost]
        public Mission Post([FromBody] Mission mission)
        {
            if (mission == null)
                throw new ArgumentNullException("Mission can not be null");
            if (mission.MissionDesc == null || mission.MissionDesc.Length == 0)
                throw new ArgumentException("Mission description is required");

            var cacheMissionsList = _cache.GetOrCreate("MissionsList", entry => {
                entry.SetPriority(CacheItemPriority.NeverRemove);
                return new List<Mission>();
            });

            var missionsListStr = HttpContext.Session.GetString("MissionsList");
            List<Mission> sessionMissionsList = getListFromSerializedMissionsList(missionsListStr);
            sessionMissionsList.Add(mission);
            var serialisedMissionsList = JsonConvert.SerializeObject(sessionMissionsList);
            HttpContext.Session.SetString("MissionsList", serialisedMissionsList);

            cacheMissionsList.Add(mission);
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetPriority(CacheItemPriority.NeverRemove);

            _cache.Set("MissionsList", cacheMissionsList, cacheEntryOptions);

            return mission;
        }

        private List<Mission> getListFromSerializedMissionsList(String missionsListStr){
            if (string.IsNullOrEmpty(missionsListStr))
            {
                return new List<Mission>();
            }
            return JsonConvert.DeserializeObject<List<Mission>>(missionsListStr);
        }
    }
}