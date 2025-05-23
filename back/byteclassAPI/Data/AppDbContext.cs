using Microsoft.EntityFrameworkCore;
using byteclassAPI.Models;

namespace byteclassAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Professor> Professores { get; set; }
        public DbSet<Materia> Materias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<Admin>().ToTable("Admins");
            modelBuilder.Entity<Aluno>().ToTable("Alunos");
            modelBuilder.Entity<Professor>().ToTable("Professores");
            modelBuilder.Entity<Materia>().ToTable("Materias");

            modelBuilder.Entity<Admin>().HasBaseType<Usuario>();
            modelBuilder.Entity<Aluno>().HasBaseType<Usuario>();
            modelBuilder.Entity<Professor>().HasBaseType<Usuario>();

            modelBuilder.Entity<Aluno>()
                .HasMany(a => a.Materias)
                .WithMany(m => m.Alunos)
                .UsingEntity(j => j.ToTable("AlunosMaterias"));

            modelBuilder.Entity<Materia>()
                .HasOne(m => m.Professor)
                .WithMany(p => p.Materias)
                .HasForeignKey(m => m.ProfessorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
