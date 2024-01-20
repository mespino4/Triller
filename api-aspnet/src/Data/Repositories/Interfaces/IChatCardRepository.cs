using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IChatCardRepository {
	Task<ChatCard> GetChatCardAsync(string senderUsername, string recipientUsername);
	void AddChatCard(ChatCard chatCard);
}
