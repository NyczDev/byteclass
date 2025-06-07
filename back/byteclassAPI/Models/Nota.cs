using System.ComponentModel.DataAnnotations;

namespace byteclassAPI.Models
{
    public class Nota
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public double Valor { get; set; }

        [Required]
        public string Descricao { get; set; } = string.Empty; // Ex: "Prova 1", "Trabalho em grupo"

        public DateTime DataLancamento { get; set; } = DateTime.UtcNow;

        // FKs
        public int AlunoId { get; set; }
        public int MateriaId { get; set; }

        // Navegação
        public Aluno? Aluno { get; set; }
        public Materia? Materia { get; set; }
    }
}