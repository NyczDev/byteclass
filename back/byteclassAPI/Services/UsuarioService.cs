using byteclassAPI.Models;
using byteclassAPI.Data;
using System.Linq;

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
            // == INÍCIO DO SUPER USUÁRIO PARA DESENVOLVIMENTO ==
            // Este bloco permite o login com usuários fixos para acesso
            // ao sistema em ambiente local.
            // ATENÇÃO: Este código é um risco de segurança e DEVE ser removido
            // antes de publicar a aplicação em um ambiente de produção.
            if (cpf == "admin" && dataNascimento == "admin")
            {
                return new Admin
                {
                    UserId = 0, // ID 0 para indicar que não vem do banco
                    Nome = "Super Administrador",
                    CPF = "admin",
                    Role = "admin",
                    DataNascimento = "01012000" // Placeholder
                };
            }
            else if (cpf == "professor" && dataNascimento == "professor")
            {
                return new Professor
                {
                    UserId = 1, // ID fictício para testes
                    Nome = "Professor Teste",
                    CPF = "professor",
                    Role = "professor",
                    DataNascimento = "02021990", // Placeholder
                    Especialidade = "Exatas",
                    Formacao = "Licenciatura em Matemática"
                };
            }
            else if (cpf == "aluno" && dataNascimento == "aluno")
            {
                return new Aluno
                {
                    UserId = 2, // ID fictício para testes
                    Nome = "Aluno Teste",
                    CPF = "aluno",
                    Role = "aluno",
                    DataNascimento = "03032005", // Placeholder
                    Telefone = "99999-9999",
                    NomeResponsavel = "Responsável Teste"
                };
            }
            // == FIM DO BLOCO DE SUPER USUÁRIO ==


            // Validação do formato da data (DDMMAAAA) para usuários normais
            if (dataNascimento.Length != 8 || !dataNascimento.All(char.IsDigit))
            {
                throw new System.ArgumentException("Data de nascimento deve estar no formato DDMMAAAA");
            }

            var usuario = _appDbContext.Usuarios
                .FirstOrDefault(u =>
                    u.CPF == cpf &&
                    u.DataNascimento == dataNascimento);

            if (usuario == null)
            {
                // A mensagem será capturada pelo controller e enviada como resposta 401
                throw new System.InvalidOperationException("Credenciais inválidas.");
            }

            return usuario;
        }
    }
}