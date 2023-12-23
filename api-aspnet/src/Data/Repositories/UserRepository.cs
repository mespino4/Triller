using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories;

public class UserRepository : IUserRepository {
	public void DeleteBannerPicture(AppUser user) {
		throw new NotImplementedException();
	}

	public void DeleteProfilePicture(AppUser user) {
		throw new NotImplementedException();
	}

	public Task<MemberDTO> GetMemberAsync(string username) {
		throw new NotImplementedException();
	}

	public Task<IEnumerable<MemberDTO>> GetMembersAsync(int currentUserId) {
		throw new NotImplementedException();
	}

	public Task<AppUser> GetUserByIdAsync(int userId) {
		throw new NotImplementedException();
	}

	public Task<AppUser> GetUserByUsernameAsync(string username) {
		throw new NotImplementedException();
	}

	public Task<IEnumerable<AppUser>> GetUsersAsync() {
		throw new NotImplementedException();
	}

	public Task<IEnumerable<TrillDTO>> GetUserTimeline(int userId) {
		throw new NotImplementedException();
	}

	public Task<IEnumerable<TrillDTO>> GetUserTimelineWithReplies(int userId) {
		throw new NotImplementedException();
	}

	public Task<bool> SaveAllAsync() {
		throw new NotImplementedException();
	}

	public void Update(AppUser user) {
		throw new NotImplementedException();
	}
}
