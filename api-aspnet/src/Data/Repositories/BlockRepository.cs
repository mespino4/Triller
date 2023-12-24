using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class BlockRepository : IBlockRepository {
	private readonly DataContext _context;
	private readonly IMapper _mapper;

	public BlockRepository(DataContext context, IMapper mapper) {
		_context = context;
		_mapper = mapper;
	}

	public void BlockUser(Block block) {
		_context.Blocks.Add(block);
	}

	public void UnblockUser(Block block) {
		_context.Blocks.Remove(block);
	}

	public bool IsUserBlocked(int userId, int memberId) {
		return _context.Blocks.Any(b =>
			b.UserId == userId && b.BlockedUserId == memberId);
	}
	public async Task<List<AppUser>> GetBlockedMembers(int userId) {
		var blockedUserIds = await _context.Blocks
			.Where(b => b.UserId == userId)
			.Select(b => b.BlockedUserId)
			.ToListAsync();

		var blockedMembers = await _context.Users
			.Where(u => blockedUserIds.Contains(u.Id))
			//.ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
			.ToListAsync();

		return blockedMembers;
	}

	public async Task<Block> GetBlock(int userId, int blockedUserId) {
		return await _context.Blocks
			.FirstOrDefaultAsync(b => b.UserId == userId && b.BlockedUserId == blockedUserId);
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}