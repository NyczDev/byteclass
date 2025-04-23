using Microsoft.AspNetCore.Mvc;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API funcionando!"); 
        }
    }
}
