using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class NotaController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public NotaController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        // Lançar nota para um aluno em uma matéria
        [HttpPost("materias/{materiaId}/alunos/{alunoId}/notas")]
        public async Task<ActionResult<Nota>> LancarNota(int materiaId, int alunoId, [FromBody] Nota novaNota, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem lançar notas.");

            var aluno = await _appDbContext.Alunos.FindAsync(alunoId);
            if (aluno == null) return NotFound("Aluno não encontrado.");

            var materia = await _appDbContext.Materias.FindAsync(materiaId);
            if (materia == null) return NotFound("Matéria não encontrada.");

            novaNota.AlunoId = alunoId;
            novaNota.MateriaId = materiaId;

            _appDbContext.Notas.Add(novaNota);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotaPorId), new { notaId = novaNota.Id }, novaNota);
        }

        // Listar notas de um aluno em uma matéria
        [HttpGet("materias/{materiaId}/alunos/{alunoId}/notas")]
        public async Task<ActionResult<IEnumerable<Nota>>> GetNotasDoAlunoNaMateria(int materiaId, int alunoId, [FromHeader(Name = "X-Role")] string? role)
        {
            // Adicionar lógica de permissão se necessário (ex: o próprio aluno pode ver)
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Acesso negado.");

            var notas = await _appDbContext.Notas
                .Where(n => n.MateriaId == materiaId && n.AlunoId == alunoId)
                .Include(n => n.Materia)
                .Include(n => n.Aluno)
                .ToListAsync();

            return Ok(notas);
        }

        // Buscar uma nota específica
        [HttpGet("notas/{notaId}")]
        public async Task<ActionResult<Nota>> GetNotaPorId(int notaId)
        {
            var nota = await _appDbContext.Notas
            .Include(n => n.Materia)
            .Include(n => n.Aluno)
            .FirstOrDefaultAsync(n => n.Id == notaId);

            if (nota == null) return NotFound("Nota não encontrada.");
            return Ok(nota);
        }
    }
}