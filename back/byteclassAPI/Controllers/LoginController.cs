using byteclassAPI.Models;
using byteclassAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace byteclassAPI.Controllers.LoginController
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public AuthController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO login)
        {
            var usuario = _usuarioService.Logar(login.CPF, login.DataNascimento);
            
            return Ok(new
            {
                id = usuario.UserId,
                nome = usuario.Nome,
                role = usuario.Role
            });
        }
    }
}
