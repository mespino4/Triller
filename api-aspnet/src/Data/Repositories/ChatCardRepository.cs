using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Data.Repositories;

public class ChatCardRepository : IChatCardRepository {
	private readonly DataContext _context;

	public ChatCardRepository(DataContext context) {
		_context = context;
	}

	public async Task<ChatCard> GetChatCardAsync(string senderUsername, string recipientUsername) {
		return await _context.ChatCards
			.FirstOrDefaultAsync(cc =>
				(cc.User1Username == senderUsername && cc.User2Username == recipientUsername) ||
				(cc.User1Username == recipientUsername && cc.User2Username == senderUsername));
	}

	public void AddChatCard(ChatCard chatCard) {
		_context.ChatCards.Add(chatCard);
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}
