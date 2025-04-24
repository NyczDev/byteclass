namespace byteclassAPI.Models
{
    public class Professor : Usuario
    {
        public string Especialidade { get; set; } = string.Empty;
        public string Formacao { get; set; } = string.Empty;
    }
}