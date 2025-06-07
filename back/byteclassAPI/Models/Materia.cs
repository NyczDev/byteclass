namespace byteclassAPI.Models
{
    public class Materia
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public List<Aluno> Alunos { get; set; } = new();
        public List<Nota> Notas { get; set; } = new();
        public List<Conteudo> Conteudos { get; set; } = new();
        public int ProfessorId { get; set; }
        public Professor? Professor { get; set; }

        public int? TurmaId { get; set; }
        public Turma? Turma { get; set; }
    }
}
