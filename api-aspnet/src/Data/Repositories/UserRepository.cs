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

	//This retrieves all users
	public async Task<IEnumerable<AppUser>> GetAllUsersAsync() {
		return await _context.Users
			.Include(b => b.BannerPicture)
			.ToListAsync();
	}

	//this only retrieves the members the current user has not blocked or been blovked by
	public async Task<IEnumerable<AppUser>> GetUsersAsync(int currentUserId) {
		return await _context.Users
			.Where(u => !_context.Blocks
			.Any(b => (b.UserId == currentUserId && b.BlockedUserId == u.Id) ||
				(b.UserId == u.Id && b.BlockedUserId == currentUserId)))
			.Include(t => t.Replies)
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

	public async Task<IEnumerable<TrillDTO>> GetUserTimeline(int userId) {
		var user = await _context.Users
			.Include(u => u.Trills)
			.Include(u => u.Retrills)
			.SingleOrDefaultAsync(u => u.Id == userId);

		if(user == null) return Enumerable.Empty<TrillDTO>();

		var trillDtos = (await _context.Trills
				.Where(t => t.AuthorId == userId)
				.Select(t => new { Trill = t, Timestamp = t.Timestamp })
				.ToListAsync()) // Materialize the results into a list
			.Concat(await _context.Retrills
				.Where(r => r.UserId == userId)
				.Select(r => new { Trill = r.Trill, Timestamp = r.CreatedAt })
				.ToListAsync()) // Materialize the results into a list
			.OrderByDescending(item => item.Timestamp)
			.ToList(); // Materialize the results into a list

		return trillDtos.Select(item => _mapper.Map<TrillDTO>(item.Trill));
	}



	public void Update(AppUser user) {
		_context.Entry(user).State = EntityState.Modified;
	}

	public void DeleteBannerPicture(AppUser user) {
		if(user.BannerPicture != null) {
			var bannerPicture = _context.UserPhotos.Find(user.BannerPicture.Id);

			if(bannerPicture != null) {
				_context.UserPhotos.Remove(bannerPicture);
				user.BannerPicture = null;
			}
		}
	}

	public void DeleteProfilePicture(AppUser user) {
		if(user.ProfilePicture != null) {
			var profilePicture = _context.UserPhotos.Find(user.ProfilePicture.Id);

			if(profilePicture != null) {
				_context.UserPhotos.Remove(profilePicture);
				user.ProfilePicture = null;
			}
		}
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}