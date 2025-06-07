using System.ComponentModel.DataAnnotations;

namespace byteclassAPI.Models
{
    public class Frequencia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Data { get; set; }

        [Required]
        public bool Presente { get; set; } // true = Presente, false = Ausente

        // FKs
        public int AlunoId { get; set; }
        public int MateriaId { get; set; }

        // Navegação
        public Aluno? Aluno { get; set; }
        public Materia? Materia { get; set; }
    }
}