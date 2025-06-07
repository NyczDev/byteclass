using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("admin/materias")]
    public class MateriaController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public MateriaController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        [HttpGet] // LISTAR MATERIAS GET: /admin/materias
        public async Task<ActionResult<IEnumerable<Materia>>> ListarMaterias([FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem listar matérias.");

            var materias = await _appDbContext.Materias
                                              .Include(m => m.Professor)
                                              .ToListAsync();
            return Ok(materias);
        }

        [HttpGet("{id}")] // MATERIA POR ID GET: /admin/materias/{id}
        public async Task<ActionResult<Materia>> ListarMateriaPorId(int id, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem listar uma matéria.");

            var materia = await _appDbContext.Materias
                                             .Include(m => m.Professor)
                                             .Include(a => a.Alunos)
                                             .FirstOrDefaultAsync(m => m.Id == id);

            if (materia == null)
                return NotFound("Matéria não encontrada.");

            return Ok(materia);
        }

        [HttpPost] // CADASTRAR MATERIA POST: /admin/materias
        public async Task<ActionResult<Materia>> CadastrarMateria([FromBody] Materia materia, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem cadastrar matérias.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _appDbContext.Materias.Add(materia);
            await _appDbContext.SaveChangesAsync();

            return Ok(materia);
        }

        [HttpPut("{id}")] // ALTERAR MATERIA PUT: /admin/materias/{id}
        public async Task<IActionResult> AlterarMateria(int id, [FromBody] Materia materiaAlterada, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem alterar matérias.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var materiaExistente = await _appDbContext.Materias.FindAsync(id);
            if (materiaExistente == null)
                return NotFound("Matéria não encontrada.");

            materiaExistente.Nome = materiaAlterada.Nome;
            materiaExistente.ProfessorId = materiaAlterada.ProfessorId;

            await _appDbContext.SaveChangesAsync();
            return Ok(materiaAlterada);
        }

        [HttpDelete("{id}")] // DELETE: /admin/materias/{id}
        public async Task<IActionResult> DeleteMateria(int id, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem excluir matérias.");

            var materia = await _appDbContext.Materias.FindAsync(id);
            if (materia == null)
                return NotFound("Matéria não encontrada.");

            _appDbContext.Materias.Remove(materia);
            await _appDbContext.SaveChangesAsync();

            return Ok("Matéria removida com sucesso.");
        }

        [HttpPost("{materiaId}/adicionar-aluno/{alunoId}")] // ADICIONAR ALUNO A MATERIA POST: /admin/materias/{materiaId}/adicionar-aluno/{alunoId}
        public async Task<IActionResult> AdicionarAlunoNaMateria(int materiaId, int alunoId, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem adicionar alunos às matérias.");

            var materia = await _appDbContext.Materias.Include(m => m.Alunos).FirstOrDefaultAsync(m => m.Id == materiaId);
            if (materia == null)
                return NotFound("Matéria não encontrada.");

            var aluno = await _appDbContext.Alunos.FindAsync(alunoId);
            if (aluno == null)
                return NotFound("Aluno não encontrado.");

            if (materia.Alunos.Any(a => a.UserId == alunoId))
                return BadRequest("Aluno já está cadastrado nesta matéria.");

            materia.Alunos.Add(aluno);
            await _appDbContext.SaveChangesAsync();

            return Ok("Aluno adicionado à matéria com sucesso.");
        }
    }
}