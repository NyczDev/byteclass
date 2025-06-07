using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("api/materias/{materiaId}/conteudos")]
    public class ConteudoController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ConteudoController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        // Adicionar conteúdo a uma matéria
        [HttpPost]
        public async Task<ActionResult<Conteudo>> AdicionarConteudo(int materiaId, [FromBody] Conteudo novoConteudo, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem adicionar conteúdo.");

            var materia = await _appDbContext.Materias.FindAsync(materiaId);
            if (materia == null) return NotFound("Matéria não encontrada.");

            novoConteudo.MateriaId = materiaId;
            _appDbContext.Conteudos.Add(novoConteudo);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConteudoPorId), new { materiaId = materiaId, conteudoId = novoConteudo.Id }, novoConteudo);
        }

        // Listar todos os conteúdos de uma matéria
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conteudo>>> GetConteudosDaMateria(int materiaId)
        {
            var conteudos = await _appDbContext.Conteudos
                .Include(m => m.Materia)
                .Where(c => c.MateriaId == materiaId)
                .ToListAsync();

            return Ok(conteudos);
        }

        // Buscar um conteúdo específico por ID
        [HttpGet("{conteudoId}")]
        public async Task<ActionResult<Conteudo>> GetConteudoPorId(int materiaId, int conteudoId)
        {
            var conteudo = await _appDbContext.Conteudos
                .Include(m => m.Materia)
                .FirstOrDefaultAsync(c => c.Id == conteudoId && c.MateriaId == materiaId);

            if (conteudo == null) return NotFound("Conteúdo não encontrado.");

            return Ok(conteudo);
        }
    }
}