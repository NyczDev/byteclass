using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public AdminController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost] // CADASTRAR ADMIN POST: /admin
        public async Task<ActionResult<Admin>> CadastrarAdmin([FromBody] Admin admin)
        {
            // valida todos os campos necessários
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            admin.Role = "admin"; // garante a role correta

            _appDbContext.Admins.Add(admin);
            await _appDbContext.SaveChangesAsync();

            return Ok(admin);
        }

        [HttpGet] // LISTAR ADMIN GET: /admin
        public async Task<ActionResult<IEnumerable<Professor>>> ListarAdmins()
        {
            var admins = await _appDbContext.Admins.ToListAsync();
            if (admins == null)
            {
                return NotFound();
            }
            return Ok(admins);
        }

    }
}
