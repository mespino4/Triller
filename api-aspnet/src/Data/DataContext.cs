using api_aspnet.src.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int,
		IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
		IdentityRoleClaim<int>, IdentityUserToken<int>> {

	public DataContext(DbContextOptions options) : base(options) { }

	public DbSet<Connection> Connections { get; set; }
	public DbSet<Trill> Trills { get; set; }
	public DbSet<Bookmark> Bookmarks { get; set; }
	public DbSet<TrillLike> TrillLikes { get; set; }
	public DbSet<UserPhoto> UserPhotos { get; set; }
	public DbSet<TrillMedia> TrillMedia { get; set; }
	public DbSet<Retrill> Retrills { get; set; }
	public DbSet<TrillReply> TrillReplies { get; set; }
	public DbSet<UserReaction> UserReactions { get; set; }
	public DbSet<Message> Messages { get; set; }
	public DbSet<ChatCard> ChatCards { get; set; }
	public DbSet<Block> Blocks { get; set; }
	public DbSet<Notification> Notifications { get; set; }

	protected override void OnModelCreating(ModelBuilder builder) {

		base.OnModelCreating(builder);

		builder.Entity<AppUser>()
			.HasMany(ur => ur.UserRoles)
			.WithOne(u => u.User)
			.HasForeignKey(ur => ur.UserId)
			.IsRequired();
	}
}
