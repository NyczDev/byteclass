using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using System.Linq;
using System.Threading.Tasks;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("api/relatorios")]
    public class RelatorioController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public RelatorioController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        // Gera o histórico escolar de um aluno
        [HttpGet("alunos/{alunoId}")]
        public async Task<IActionResult> GetHistoricoAluno(int alunoId)
        {
            var aluno = await _appDbContext.Alunos

                .FirstOrDefaultAsync(a => a.UserId == alunoId);

            if (aluno == null)
            {
                return NotFound("Aluno não encontrado.");
            }

            var materiasDoAluno = await _appDbContext.Materias
                .Where(m => m.Alunos.Any(a => a.UserId == alunoId))
                .Include(m => m.Professor)
                .Select(m => new
                {
                    m.Id,
                    m.Nome,
                    Professor = m.Professor != null ? m.Professor.Nome : "N/A",
                    Notas = _appDbContext.Notas
                                .Where(n => n.MateriaId == m.Id && n.AlunoId == alunoId)
                                .Select(n => new { n.Id, n.Valor, n.Descricao, n.DataLancamento })
                                .ToList(),
                    Frequencias = _appDbContext.Frequencias
                                    .Where(f => f.MateriaId == m.Id && f.AlunoId == alunoId)
                                    .Select(f => new { f.Id, f.Data, f.Presente })
                                    .ToList()
                })
                .ToListAsync();

            var relatorio = new
            {
                AlunoInfo = new
                {
                    aluno.UserId,
                    aluno.Nome,
                    aluno.CPF,
                    aluno.DataNascimento,
                    aluno.NomeResponsavel,
                    aluno.Telefone
                },
                Historico = materiasDoAluno
            };

            return Ok(relatorio);
        }

        [HttpGet("materias/{materiaId}")]
        public async Task<IActionResult> GetRelatorioMateria(int materiaId, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Acesso negado. Apenas administradores e professores podem ver este relatório.");

            var materia = await _appDbContext.Materias
                .AsNoTracking()
                .Include(m => m.Professor)
                .FirstOrDefaultAsync(m => m.Id == materiaId);

            if (materia == null)
            {
                return NotFound("Matéria não encontrada.");
            }

            var alunosDaMateria = await _appDbContext.Alunos
                .Where(a => a.Materias.Any(m => m.Id == materiaId))
                .Select(a => new
                {
                    a.UserId,
                    a.Nome,
                    Notas = a.Notas
                             .Where(n => n.MateriaId == materiaId)
                             .Select(n => new { n.Valor, n.Descricao })
                             .ToList()
                })
                .ToListAsync();

            var relatorio = new
            {
                MateriaInfo = new
                {
                    materia.Id,
                    materia.Nome,
                    Professor = materia.Professor?.Nome
                },
                Alunos = alunosDaMateria
            };

            return Ok(relatorio);
        }

    }
}