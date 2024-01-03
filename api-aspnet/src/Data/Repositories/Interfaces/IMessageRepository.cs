using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Helpers;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IMessageRepository {
	void AddMessage(Message message);
	void DeleteMessage(Message message);
	Task<Message> GetMessage(int id);
	Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams);
	Task<IEnumerable<MessageDTO>> GetMessageThread(string userUsername, string recipientUsername);
	Task<IEnumerable<ChatCardDTO>> GetRecentChats(string username);
	Task<bool> SaveAllAsync();
}
