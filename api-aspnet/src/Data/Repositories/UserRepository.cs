using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class UserRepository : IUserRepository {
	private readonly DataContext _context;
	private readonly IMapper _mapper;

	public UserRepository(DataContext context, IMapper mapper) {
		_context = context;
		_mapper = mapper;
	}

	public void DeleteBannerPicture(AppUser user) {
		if(user.BannerPicture != null) {
			var bannerPicture = _context.UserPhotos.Find(user.BannerPicture.Id);

			if(bannerPicture != null) {
				// Remove the profile picture from the DbSet
				_context.UserPhotos.Remove(bannerPicture);

				// Update the user entity to nullify the reference
				user.BannerPicture = null;

				// Save changes to the database
				_context.SaveChanges();
			}
		}
	}

	public void DeleteProfilePicture(AppUser user) {
		if(user.ProfilePicture != null) {
			// Assuming you have a DbSet<UserPhoto> in your DbContext named "UserPhotos"
			var profilePicture = _context.UserPhotos.Find(user.ProfilePicture.Id);

			if(profilePicture != null) {
				// Remove the profile picture from the DbSet
				_context.UserPhotos.Remove(profilePicture);

				// Update the user entity to nullify the reference
				user.ProfilePicture = null;

				// Save changes to the database
				_context.SaveChanges();
			}
		}
	}

	public async Task<IEnumerable<AppUser>> GetUsersAsync(int currentUserId) {
		return await _context.Users
			.Where(u => !_context.Blocks
			.Any(b => (b.UserId == currentUserId && b.BlockedUserId == u.Id) ||
				(b.UserId == u.Id && b.BlockedUserId == currentUserId)))
			.ToListAsync();
	}

	public async Task<AppUser> GetUserByIdAsync(int id) {
		return await _context.Users
			.Where(u => u.Id == id)
			.SingleOrDefaultAsync();
	}

	public async Task<AppUser> GetUserByUsernameAsync(string username) {
		return await _context.Users
			.Include(f => f.Followers)
			.Include(f => f.Following)
			.Include(p => p.ProfilePicture)
			.Include(b => b.BannerPicture)
			.SingleOrDefaultAsync(x => x.UserName == username);
	}

	public async Task<IEnumerable<AppUser>> GetAllUsersAsync() {
		return await _context.Users
			.Include(b => b.BannerPicture)
			.ToListAsync();
	}

	public async Task<IEnumerable<Trill>> GetUserTimeline(int userId) {
		var user = await _context.Users
			.Include(u => u.Trills)
			.Include(u => u.Retrills)
			.SingleOrDefaultAsync(u => u.Id == userId);

		if(user == null) return Enumerable.Empty<Trill>();

		var trills = await _context.Trills
			.Where(t => t.AuthorId == userId)
			.ToListAsync();

		var retrills = await _context.Retrills
			.Where(r => r.UserId == userId)
			.Select(r => r.Trill)
			.ToListAsync();

		var timeline = trills.Concat(retrills);

		return timeline
			.OrderByDescending(trill => trill.Timestamp)
			.ToList();
	}


	public async Task<IEnumerable<Trill>> GetUserTimelineWithReplies(int userId) {
		var user = await _context.Users
			.Include(u => u.Trills)
			.Include(u => u.Retrills)
			.SingleOrDefaultAsync(u => u.Id == userId);

		if(user == null) return Enumerable.Empty<Trill>();

		var trills = await _context.Trills
			.Where(t => t.AuthorId == userId)
			.Include(t => t.Replies)  // Include the Replies relationship if applicable
			.ToListAsync();

		var retrills = await _context.Retrills
			.Where(r => r.UserId == userId)
			.Select(r => r.Trill)
			.Include(t => t.Replies)  // Include the Replies relationship if applicable
			.ToListAsync();

		var timeline = trills.Concat(retrills);

		return timeline
			.OrderByDescending(trill => trill.Timestamp)
			.ToList();
	}


	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}

	public void Update(AppUser user) {
		_context.Entry(user).State = EntityState.Modified;
	}
}


