using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using byteclassAPI.Data;
using byteclassAPI.Models;

namespace byteclassAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class AtividadeController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public AtividadeController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        private bool IsAdmin(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "admin";
        private bool IsProf(string? role) => !string.IsNullOrEmpty(role) && role.ToLower() == "professor";

        // Criar uma nova atividade para uma matéria
        [HttpPost("materias/{materiaId}/atividades")]
        public async Task<ActionResult<Atividade>> CriarAtividade(int materiaId, [FromBody] Atividade novaAtividade, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem criar atividades.");

            var materia = await _appDbContext.Materias.FindAsync(materiaId);
            if (materia == null) return NotFound("Matéria não encontrada.");

            novaAtividade.MateriaId = materiaId;
            _appDbContext.Atividades.Add(novaAtividade);
            await _appDbContext.SaveChangesAsync();

            return Ok(novaAtividade);
        }

        // Listar todas as atividades de uma matéria
        [HttpGet("materias/{materiaId}/atividades")]
        public async Task<ActionResult<IEnumerable<Atividade>>> ListarAtividades(int materiaId)
        {
            var atividades = await _appDbContext.Atividades
                .Where(a => a.MateriaId == materiaId)
                .ToListAsync();
            
            return Ok(atividades);
        }

        // Aluno entrega uma atividade
        [HttpPost("atividades/{atividadeId}/entregar")]
        public async Task<ActionResult<EntregaAtividade>> EntregarAtividade(int atividadeId, [FromBody] EntregaAtividade novaEntrega)
        {
            var atividade = await _appDbContext.Atividades.FindAsync(atividadeId);
            if (atividade == null) return NotFound("Atividade não encontrada.");

            // Valida se o aluno existe
            var aluno = await _appDbContext.Alunos.FindAsync(novaEntrega.AlunoId);
            if (aluno == null) return NotFound("Aluno não encontrado.");

            novaEntrega.AtividadeId = atividadeId;
            
            _appDbContext.EntregasAtividades.Add(novaEntrega);
            await _appDbContext.SaveChangesAsync();

            return Ok(novaEntrega);
        }

        // Professor/Admin visualiza as entregas de uma atividade
        [HttpGet("atividades/{atividadeId}/entregas")]
        public async Task<ActionResult<IEnumerable<EntregaAtividade>>> VerEntregas(int atividadeId, [FromHeader(Name = "X-Role")] string? role)
        {
            if (!IsAdmin(role) && !IsProf(role))
                return StatusCode(403, "Apenas administradores e professores podem visualizar as entregas.");

            var entregas = await _appDbContext.EntregasAtividades
                .Where(e => e.AtividadeId == atividadeId)
                .Include(e => e.Aluno) // Inclui os dados do aluno em cada entrega
                .ToListAsync();

            return Ok(entregas);
        }
    }
}