using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("api/materias/{materiaId}/frequencia")]
    public class FrequenciaController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public FrequenciaController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        // Lançar frequência para um aluno em uma data
        [HttpPost("alunos/{alunoId}")]
        public async Task<ActionResult<Frequencia>> LancarFrequencia(int materiaId, int alunoId, [FromBody] Frequencia novaFrequencia, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem lançar frequência.");

            // Validar se matéria e aluno existem
            var materia = await _appDbContext.Materias.AnyAsync(m => m.Id == materiaId);
            if (!materia) return NotFound("Matéria não encontrada.");

            var aluno = await _appDbContext.Alunos.AnyAsync(a => a.UserId == alunoId);
            if (!aluno) return NotFound("Aluno não encontrado.");

            novaFrequencia.MateriaId = materiaId;
            novaFrequencia.AlunoId = alunoId;

            _appDbContext.Frequencias.Add(novaFrequencia);
            await _appDbContext.SaveChangesAsync();

            return Ok(novaFrequencia);
        }

        // Consultar frequência de um aluno em uma matéria
        [HttpGet("alunos/{alunoId}")]
        public async Task<ActionResult<IEnumerable<Frequencia>>> GetFrequenciaDoAluno(int materiaId, int alunoId)
        {
            var frequencias = await _appDbContext.Frequencias
                .Where(f => f.MateriaId == materiaId && f.AlunoId == alunoId)
                .OrderBy(f => f.Data)
                .Include(a => a.Aluno)
                .Include(m => m.Materia)
                .ToListAsync();

            return Ok(frequencias);
        }

        // Consultar a lista de presença (chamada) de uma matéria em uma data específica
        [HttpGet("data/{data}")]
        public async Task<ActionResult<IEnumerable<Frequencia>>> GetChamadaPorData(int materiaId, DateTime data)
        {
            var chamada = await _appDbContext.Frequencias
                .Where(f => f.MateriaId == materiaId && f.Data.Date == data.Date)
                .Include(f => f.Aluno)
                .ToListAsync();

            return Ok(chamada);
        }

        [HttpPut("{frequenciaId}")]
        public async Task<IActionResult> AlterarFrequencia(int materiaId, int frequenciaId, [FromBody] Frequencia frequenciaAlterada, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem alterar a frequência.");

            var frequenciaExistente = await _appDbContext.Frequencias
                .FirstOrDefaultAsync(f => f.Id == frequenciaId && f.MateriaId == materiaId);

            if (frequenciaExistente == null)
            {
                return NotFound("Registro de frequência não encontrado.");
            }

            // Atualiza o status de presença
            frequenciaExistente.Presente = frequenciaAlterada.Presente;

            await _appDbContext.SaveChangesAsync();

            return Ok(frequenciaExistente);
        }
    }
}