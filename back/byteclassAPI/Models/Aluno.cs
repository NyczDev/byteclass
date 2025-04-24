namespace byteclassAPI.Models
{
    public class Aluno : Usuario
    {
        public string Telefone { get; set; } = string.Empty;
        public string NomeResponsavel { get; set; } = string.Empty;
    }
    
}