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
    }
}