using System.ComponentModel.DataAnnotations;

namespace byteclassAPI.Models
{
    public class EntregaAtividade
    {
        [Key]
        public int Id { get; set; }

        public string Conteudo { get; set; } = string.Empty;
        public DateTime DataEntrega { get; set; } = DateTime.UtcNow;

        // FKs
        public int AlunoId { get; set; }
        public int AtividadeId { get; set; }

        // Navegação
        public Aluno? Aluno { get; set; }
        public Atividade? Atividade { get; set; }
    }
}