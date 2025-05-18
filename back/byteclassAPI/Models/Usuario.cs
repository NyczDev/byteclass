namespace byteclassAPI.Models;

using System.ComponentModel.DataAnnotations;
public class Usuario
{
    [Key]
    public int UserId { get; set; }
    [Required]
    public string Nome { get; set; } = string.Empty;
    [Required]
    public string CPF { get; set; } = string.Empty;
    [Required]
    public string DataNascimento { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

