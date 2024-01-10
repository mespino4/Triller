using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class ConnectionRepository : IConnectionRepository{
	private readonly DataContext _context;
	private readonly IMapper _mapper;

	public ConnectionRepository(DataContext context, IMapper mapper) {
		_context = context;
		_mapper = mapper;
	}

	public void AddConnection(Connection connection) {
		_context.Connections.Add(connection);
	}

	public void RemoveConnection(Connection connection) {
		_context.Connections.Remove(connection);
	}

	public async Task<List<MemberDTO>> GetConnections(string predicate, int userId) {
		// Initialize IQueryable variable for follows
		var follows = _context.Connections.AsQueryable();

		// Check the predicate to determine the type of relationship to fetch
		if(predicate == "following") {
			// Filter the 'follows' collection to get users being followed
			follows = follows.Where(follow => follow.SourceUserId == userId);
		} else if(predicate == "followers") {
			// Filter the 'follows' collection to get users who are followers
			follows = follows.Where(follow => follow.TargetUserId == userId);
		}

		// Project user information into MemberDto objects and return as a collection.
		var users = follows.Select(follow => predicate == "following" ? follow.TargetUser : follow.SourceUser);
		var memberDtos = await _mapper.ProjectTo<MemberDTO>(users).ToListAsync();

		return memberDtos;
	}


	public async Task<Connection> GetUserConnection(int sourceUserId, int targetUserId) {
		var connection = await _context.Connections
			.SingleOrDefaultAsync(c =>
				c.SourceUserId == sourceUserId && c.TargetUserId == targetUserId);

		return connection;
	}




	public async Task<bool> GetConnectionStatus(int sourceUserId, int targetUserId) {
		var connection = await _context.Connections
			.SingleOrDefaultAsync(c =>
				c.SourceUserId == sourceUserId && c.TargetUserId == targetUserId);

		return connection != null; // Returns true if the connection exists, false otherwise
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}
