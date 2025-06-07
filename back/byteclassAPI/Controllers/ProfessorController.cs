using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("admin/professores")]
    public class ProfessorController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ProfessorController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // método para validar se é Admin ou não
        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";


        [HttpGet] // LISTAR PROFESSORES GET: /admin/professores
        public async Task<ActionResult<IEnumerable<Professor>>> ListarProfessores([FromHeader(Name = "X-Role")] string? role)
        {

            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem listar professores.");

            var professores = await _appDbContext.Professores.ToListAsync();
            return Ok(professores);
        }


        [HttpGet("{id}")] // PROFESSOR POR ID GET: /admin/professores/{id}
        public async Task<ActionResult<Professor>> ListarProfessorPorId(int id, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem listar um professor.");

            var professor = await _appDbContext.Professores.FindAsync(id);
            if (professor == null)
                return NotFound("Professor não encontrado.");
            return Ok(professor);
        }


        [HttpPost] // CADASTRAR PROFESSOR POST: /admin/professores
        public async Task<ActionResult<Professor>> CadastrarProfessor([FromBody] Professor professor, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem cadastrar professores.");

            // valida todos os campos necessários
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // valida cpf existente
            if (_appDbContext.Usuarios.Any(u => u.CPF == professor.CPF))
                return BadRequest(new { message = "CPF já cadastrado!" });

            professor.Role = "professor"; // garante a role correta

            _appDbContext.Professores.Add(professor);
            await _appDbContext.SaveChangesAsync();

            return Ok(professor);
        }


        [HttpPut("{id}")] // ALTERAR PROFESSOR PUT: /admin/professores/{id}
        public async Task<IActionResult> AlterarProfessor(int id, [FromBody] Professor professorAlterado, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem alterar professores.");

            // valida todos os campos necessários
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var professorExistente = await _appDbContext.Professores.FindAsync(id);
            if (professorExistente == null)
                return NotFound("Professor não encontrado.");

            // valida cpf ja existente
            if (professorExistente.CPF != professorAlterado.CPF && _appDbContext.Usuarios.Any(u => u.CPF == professorAlterado.CPF))
                return BadRequest(new { message = "CPF já cadastrado para outro usuário!" });

            professorExistente.Nome = professorAlterado.Nome;
            professorExistente.CPF = professorAlterado.CPF;
            professorExistente.DataNascimento = professorAlterado.DataNascimento;
            professorExistente.Especialidade = professorAlterado.Especialidade;
            professorExistente.Formacao = professorAlterado.Formacao;

            await _appDbContext.SaveChangesAsync();
            return Ok(professorAlterado);
        }


        [HttpDelete("{id}")] // DELETE: /admin/professores/{id}
        public async Task<IActionResult> DeleteProfessor(int id, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem excluir professores.");

            var professor = await _appDbContext.Professores.FindAsync(id);
            if (professor == null)
                return NotFound("Professor não encontrado.");

            _appDbContext.Professores.Remove(professor);
            await _appDbContext.SaveChangesAsync();

            return Ok("Professor removido com sucesso.");
        }

        [HttpGet("{id}/materias")] // LISTAR MATERIAS DO PROFESSOR GET: /api/professores/{id}/materias
        public async Task<ActionResult<IEnumerable<Materia>>> ListarMateriasDoProfessor(int id)
        {
            var professor = await _appDbContext.Professores
                                               .Include(p => p.Materias)
                                               .FirstOrDefaultAsync(p => p.UserId == id);

            if (professor == null)
            {
                return NotFound("Professor não encontrado.");
            }

            return Ok(professor.Materias);
        }

    }
}