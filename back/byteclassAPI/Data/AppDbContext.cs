using Microsoft.EntityFrameworkCore;
using byteclassAPI.Models;

namespace byteclassAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Professor> Professores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<Admin>().ToTable("Admins");
            modelBuilder.Entity<Aluno>().ToTable("Alunos");
            modelBuilder.Entity<Professor>().ToTable("Professores");

            modelBuilder.Entity<Admin>().HasBaseType<Usuario>();
            modelBuilder.Entity<Aluno>().HasBaseType<Usuario>();
            modelBuilder.Entity<Professor>().HasBaseType<Usuario>();
        }
    }
}