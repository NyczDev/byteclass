using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("admin/turmas")]
    public class TurmaController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public TurmaController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";

        // Criar uma nova turma
        [HttpPost]
        public async Task<ActionResult<Turma>> CriarTurma([FromBody] Turma novaTurma, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem criar turmas.");

            _appDbContext.Turmas.Add(novaTurma);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTurmaPorId), new { id = novaTurma.Id }, novaTurma);
        }

        // Listar todas as turmas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Turma>>> GetTurmas()
        {
            var turmas = await _appDbContext.Turmas
                .Include(t => t.Materias)
                    .ThenInclude(m => m.Alunos)
                .ToListAsync();
            return Ok(turmas);
        }

        // Buscar uma turma por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Turma>> GetTurmaPorId(int id)
        {
            var turma = await _appDbContext.Turmas
                .Include(t => t.Materias)
                    .ThenInclude(m => m.Professor)
                .Include(t => t.Materias)
                    .ThenInclude(m => m.Alunos)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (turma == null)
            {
                return NotFound("Turma não encontrada.");
            }

            return Ok(turma);
        }

        // Adicionar matéria a uma turma
        [HttpPost("{turmaId}/materias/{materiaId}")]
        public async Task<IActionResult> AdicionarMateriaNaTurma(int turmaId, int materiaId, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem adicionar matérias às turmas.");

            var turma = await _appDbContext.Turmas.FindAsync(turmaId);
            if (turma == null) return NotFound("Turma não encontrada.");

            var materia = await _appDbContext.Materias.FindAsync(materiaId);
            if (materia == null) return NotFound("Matéria não encontrada.");

            materia.TurmaId = turmaId;
            await _appDbContext.SaveChangesAsync();

            return Ok("Matéria adicionada à turma com sucesso.");
        }
    }
}