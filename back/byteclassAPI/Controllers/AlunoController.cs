using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("admin/alunos")]
    public class AlunoController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public AlunoController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // método para validar se é admin/professor ou não
        private bool IsAdmin(string role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        [HttpGet] // LISTAR ALUNOS GET: /admin/alunos
        public async Task<ActionResult<IEnumerable<Aluno>>> ListarAlunos([FromHeader(Name = "X-Role")] string? role)
        {

            // valida a role
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem listar alunos.");

            var alunos = await _appDbContext.Alunos.ToListAsync();
            return Ok(alunos);
        }


        [HttpGet("{id}")] // ALUNO POR ID GET: /admin/alunos/{id}
        public async Task<ActionResult<Aluno>> ListarAlunoPorId(int id, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem listar alunos.");

            var aluno = await _appDbContext.Alunos.FindAsync(id);
            if (aluno == null)
                return NotFound("Aluno não encontrado.");

            return Ok(aluno);
        }


        [HttpPost] // CADASTRAR ALUNO POST: /admin/alunos
        public async Task<ActionResult<Aluno>> CadastrarAluno([FromBody] Aluno aluno, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem cadastrar alunos.");

            // valida todos os campos necessários
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // valida cpf existente
            if (_appDbContext.Usuarios.Any(u => u.CPF == aluno.CPF))
                return BadRequest(new { message = "CPF já cadastrado!" });

            aluno.Role = "aluno"; // garante a role correta

            _appDbContext.Alunos.Add(aluno);
            await _appDbContext.SaveChangesAsync();

            return Ok(aluno);
        }


        [HttpPut("{id}")] // ALTERAR ALUNO PUT: /admin/alunos/{id}
        public async Task<IActionResult> AlterarAluno(int id, [FromBody] Aluno alunoAlterado, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem alterar alunos.");

            // valida todos os campos necessários
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var alunoExistente = await _appDbContext.Alunos.FindAsync(id);
            if (alunoExistente == null)
                return NotFound("Aluno não encontrado.");

            // valida cpf ja existente
            if (alunoExistente.CPF != alunoAlterado.CPF && _appDbContext.Usuarios.Any(u => u.CPF == alunoAlterado.CPF))
                return BadRequest(new { message = "CPF já cadastrado para outro usuário!" });

            alunoExistente.Nome = alunoAlterado.Nome;
            alunoExistente.CPF = alunoAlterado.CPF;
            alunoExistente.DataNascimento = alunoAlterado.DataNascimento;
            alunoExistente.Telefone = alunoAlterado.Telefone;
            alunoExistente.NomeResponsavel = alunoAlterado.NomeResponsavel;

            await _appDbContext.SaveChangesAsync();
            return Ok(alunoAlterado);
        }


        [HttpDelete("{id}")] // DELETE: /admin/alunos/{id}
        public async Task<IActionResult> DeleteAluno(int id, [FromHeader(Name = "X-Role")] string? role)
        {
            // valida a role
            if (!IsAdmin(role))
                return StatusCode(403, "Apenas administradores podem excluir alunos.");

            var aluno = await _appDbContext.Alunos.FindAsync(id);
            if (aluno == null)
                return NotFound("Aluno não encontrado.");

            _appDbContext.Alunos.Remove(aluno);
            await _appDbContext.SaveChangesAsync();

            return Ok("Aluno removido com sucesso.");
        }

    }
}