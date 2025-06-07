using System.ComponentModel.DataAnnotations;

namespace byteclassAPI.Models
{
    public class Turma
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nome { get; set; } = string.Empty; // Ex: "9º Ano A", "Terceirão 2025"

        public string PeriodoLetivo { get; set; } = string.Empty; // Ex: "2025"

        // Navegação: Uma turma pode ter várias matérias
        public List<Materia> Materias { get; set; } = new();
    }
}