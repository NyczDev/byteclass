namespace byteclassAPI.Models;
using System.ComponentModel.DataAnnotations;
public class Usuario
{
    [Key]
    public int UserId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string DataNascimento { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

