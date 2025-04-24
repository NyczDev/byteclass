using byteclassAPI.Models;
using byteclassAPI.Data;

namespace byteclassAPI.Services
{
    public class UsuarioService
    {
        private readonly AppDbContext _appDbContext;

        public UsuarioService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public Usuario Logar(string cpf, string dataNascimento)
        {
            // Validação do formato da data (DDMMAAAA)
            if (dataNascimento.Length != 8 || !dataNascimento.All(char.IsDigit))
            {
                throw new ArgumentException("Data de nascimento deve estar no formato DDMMAAAA");
            }

            var usuario = _appDbContext.Usuarios
                .FirstOrDefault(u =>
                    u.CPF == cpf &&
                    u.DataNascimento == dataNascimento);

            if (usuario == null)
            {
                throw new InvalidOperationException("Usuário não encontrado.");
            }

            return usuario;
        }
    }
}