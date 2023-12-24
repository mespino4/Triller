﻿using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

// This interface represents a repository for managing user-related operations in an application.
public interface IUserRepository {
	void Update(AppUser user);
	Task<IEnumerable<AppUser>> GetAllUsersAsync();
	Task<AppUser> GetUserByIdAsync(int userId);
	Task<AppUser> GetUserByUsernameAsync(string username);
	Task<IEnumerable<AppUser>> GetUsersAsync(int currentUserId);
	//Task<MemberDTO> GetMemberAsync(string username);
	Task<IEnumerable<Trill>> GetUserTimeline(int userId);
	Task<IEnumerable<Trill>> GetUserTimelineWithReplies(int userId);

	public void DeleteProfilePicture(AppUser user);
	public void DeleteBannerPicture(AppUser user);
	Task<bool> SaveAllAsync();
}
