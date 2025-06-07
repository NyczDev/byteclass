namespace byteclassAPI.Models
{
    public class Aluno : Usuario
    {
        public string Telefone { get; set; } = string.Empty;
        public string NomeResponsavel { get; set; } = string.Empty;


        public List<Materia> Materias { get; set; } = new();
        public List<Nota> Notas { get; set; } = new();
        public List<Frequencia> Frequencias { get; set; } = new();
        public List<EntregaAtividade> Entregas { get; set; } = new();
    }
}
