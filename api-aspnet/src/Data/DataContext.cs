using api_aspnet.src.Entities;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data;

public class DataContext : DbContext {
	public DataContext(DbContextOptions options) : base(options) {
	}

	public DbSet<AppUser> Users { get; set; }
}
