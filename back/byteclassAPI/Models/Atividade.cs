using System.ComponentModel.DataAnnotations;

namespace byteclassAPI.Models
{
    public class Atividade
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Titulo { get; set; } = string.Empty;

        public string Descricao { get; set; } = string.Empty;

        public DateTime DataPublicacao { get; set; } = DateTime.UtcNow;
        
        public DateTime? DataEntrega { get; set; }

        // FK
        public int MateriaId { get; set; }
        public Materia? Materia { get; set; }

        // Uma atividade pode ter várias entregas (uma por aluno)
        public List<EntregaAtividade> Entregas { get; set; } = new();
    }
}