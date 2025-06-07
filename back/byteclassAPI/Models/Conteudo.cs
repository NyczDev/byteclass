using System.ComponentModel.DataAnnotations;

namespace byteclassAPI.Models
{
    public class Conteudo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Titulo { get; set; } = string.Empty;

        public string Descricao { get; set; } = string.Empty;

        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

        // FK
        public int MateriaId { get; set; }

        // Navegação
        public Materia? Materia { get; set; }
    }
}