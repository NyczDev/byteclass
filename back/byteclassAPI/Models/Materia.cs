namespace byteclassAPI.Models
{
    public class Materia
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public List<Aluno> Alunos { get; set; } = new();
        public int ProfessorId { get; set; }
        public Professor Professor { get; set; }
    }
}
