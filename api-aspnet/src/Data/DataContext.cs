using api_aspnet.src.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int,
		IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
		IdentityRoleClaim<int>, IdentityUserToken<int>>(options) {
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

		builder.Entity<AppRole>()
			.HasMany(ur => ur.UserRoles)
			.WithOne(u => u.Role)
			.HasForeignKey(ur => ur.RoleId)
			.IsRequired();

		//Connections
		builder.Entity<Connection>()
		 .HasOne(s => s.SourceUser)
		 .WithMany(f => f.Following)
		 .HasForeignKey(s => s.SourceUserId)
		 .OnDelete(DeleteBehavior.Cascade);

		builder.Entity<Connection>()
		 .HasOne(s => s.TargetUser)
		 .WithMany(f => f.Followers)
		 .HasForeignKey(s => s.TargetUserId)
		 .OnDelete(DeleteBehavior.NoAction);

		//Bookmarks
		builder.Entity<Bookmark>()
			.HasKey(k => new { k.UserId, k.TrillId });

		builder.Entity<Bookmark>()
		 .HasOne(u => u.User)
		 .WithMany(b => b.Bookmarks)
		 .HasForeignKey(u => u.UserId)
		 .OnDelete(DeleteBehavior.Cascade);

		builder.Entity<Bookmark>()
		 .HasOne(t => t.Trill)
		 .WithMany(b => b.BookmarkedByUsers)
		 .HasForeignKey(u => u.TrillId)
		 .OnDelete(DeleteBehavior.NoAction);

		//Trill Likes
		builder.Entity<TrillLike>()
			.HasKey(k => new { k.UserId, k.TrillId });

		builder.Entity<TrillLike>()
		 .HasOne(u => u.User)
		 .WithMany(t => t.TrillsLiked)
		 .HasForeignKey(u => u.UserId)
		 .OnDelete(DeleteBehavior.Cascade);

		builder.Entity<TrillLike>()
		 .HasOne(t => t.Trill)
		 .WithMany(t => t.Likes)
		 .HasForeignKey(t => t.TrillId)
		 .OnDelete(DeleteBehavior.NoAction);

		// UserPhotos
		builder.Entity<UserPhoto>()
			.HasKey(up => up.Id);

		// Relationship between UserPhoto and AppUser for ProfilePicture
		builder.Entity<UserPhoto>()
			.HasOne(up => up.ProfilePicture)
			.WithOne(u => u.ProfilePicture)
			.HasForeignKey<UserPhoto>(up => up.ProfilePictureId)
			.OnDelete(DeleteBehavior.Cascade);

		// Relationship between UserPhoto and AppUser for BannerPicture
		builder.Entity<UserPhoto>()
			.HasOne(up => up.BannerPicture)
			.WithOne(u => u.BannerPicture)
			.HasForeignKey<UserPhoto>(up => up.BannerPictureId)
			.OnDelete(DeleteBehavior.NoAction);


		//Trills
		builder.Entity<Trill>()
			.HasMany(t => t.Replies) // One Trill has many Replies
			.WithOne(tr => tr.ParentTrill) // Each Reply has one ParentTrill
			.HasForeignKey(tr => tr.ParentTrillId); // Foreign key property

		//reactions
		builder.Entity<UserReaction>()
			.HasKey(react => new { react.Id });

		builder.Entity<UserReaction>()
			.HasOne(react => react.User)
			.WithMany()
			.HasForeignKey(react => react.UserId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.Entity<UserReaction>()
			.HasOne(react => react.TrillReply)
			.WithMany(tr => tr.Reactions)
			.HasForeignKey(react => react.TrillReplyId)
			.OnDelete(DeleteBehavior.NoAction);

		//enum values for reactions
		builder.Entity<UserReaction>()
			.Property(e => e.ReactionType)
			.HasConversion<string>();

		builder.Entity<UserReaction>()
			.Property(e => e.ReactionType)
			.HasDefaultValue(ReactionType.None);

		//Messages
		builder.Entity<Message>()
			.HasOne(u => u.Recipient)
			.WithMany(m => m.MessagesReceived)
			.OnDelete(DeleteBehavior.Cascade);

		builder.Entity<Message>()
			.HasOne(u => u.Sender)
			.WithMany(m => m.MessagesSent)
			.OnDelete(DeleteBehavior.NoAction);

		//ChatCards
		builder.Entity<ChatCard>()
			.HasMany(c => c.Messages)
			.WithOne(m => m.ChatCard)
			.HasForeignKey(m => m.ChatCardId);

		//Block
		builder.Entity<Block>()
			.HasKey(b => b.Id);

		builder.Entity<Block>()
			.HasOne(b => b.User)
			.WithMany(u => u.BlocksInitiated)
			.HasForeignKey(b => b.UserId)
			.IsRequired()
		    .OnDelete(DeleteBehavior.Cascade);

		//notifications
		builder.Entity<Notification>()
			.HasOne(n => n.User)
			.WithMany(u => u.Notifications)
			.HasForeignKey(n => n.UserId)
			.OnDelete(DeleteBehavior.Cascade); // Choose the appropriate delete behavior

		builder.Entity<Notification>()
			.HasOne(n => n.Member)
			.WithMany()
			.HasForeignKey(n => n.MemberId)
			.OnDelete(DeleteBehavior.NoAction);
	}
}
