using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Helpers;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using api_aspnet.src.Data.Repositories.Interfaces;

namespace api_aspnet.src.Data.Repositories;

public class MessageRepository : IMessageRepository{
	private readonly DataContext _context;
	private readonly IMapper _mapper;
	public MessageRepository(DataContext context, IMapper mapper) {
		_mapper = mapper;
		_context = context;
	}

	public void AddMessage(Message message) {
		_context.Messages.Add(message);
	}

	public void DeleteMessage(Message message) {
		_context.Messages.Remove(message);
	}

	public async Task<Message> GetMessage(int id) {
		return await _context.Messages
			.Include(u => u.Sender)
			.Include(u => u.Recipient)
			.SingleOrDefaultAsync(x => x.Id == id);
	}

	public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams) {
		var query = _context.Messages
			.OrderBy(m => m.Timestamp)
			.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider)
			.AsQueryable();

		query = messageParams.Container switch {
			"Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username
				&& u.RecipientDeleted == false),
			"Outbox" => query.Where(u => u.SenderUsername == messageParams.Username
				&& u.SenderDeleted == false),
			_ => query.Where(u => u.RecipientUsername ==
				messageParams.Username && u.RecipientDeleted == false && u.DateRead == null)
		};

		return await PagedList<MessageDTO>
			.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
	}

	public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername,
		string recipientUsername) {
		var messages = await _context.Messages
			.Where(m => m.Recipient.UserName == currentUsername
				&& m.RecipientDeleted == false
				&& m.Sender.UserName == recipientUsername
				|| m.Recipient.UserName == recipientUsername
				&& m.Sender.UserName == currentUsername && m.SenderDeleted == false
			)
			.Include(u => u.Sender)
			.Include(u => u.Recipient)
			//.OrderByDescending(m => m.MessageSent)
			.OrderBy(m => m.Timestamp)
			//.ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
			.ToListAsync();

		/*
		var unreadMessages = messages.Where(m => m.DateRead == null
			&& m.RecipientUsername == currentUsername).ToList();

		if(unreadMessages.Any()) {
			foreach(var message in unreadMessages)
				message.DateRead = DateTime.Now;
			await _context.SaveChangesAsync();
		}
		*/

		return _mapper.Map<IEnumerable<MessageDTO>>(messages);
	}

	/*
	public async Task<IEnumerable<ChatCardDTO>> GetRecentChats(string username) {
		var recentChats = await _context.ChatCards
			.Where(cc => cc.User1Username == username || cc.User2Username == username)
			.OrderByDescending(cc => cc.Timestamp)
			.ToListAsync();

		var chatCardDtos = recentChats
			.Select(latestChat => new ChatCardDTO {
				ChatPartnerUsername = username == latestChat.User1Username
					? latestChat.User2Username
					: latestChat.User1Username,
				RecentMessage = latestChat.RecentMessage,
				Timestamp = latestChat.Timestamp
			});

		return chatCardDtos;
	}
	*/
	public async Task<IEnumerable<ChatCardDTO>> GetRecentChats(string username) {
		var recentChats = await _context.ChatCards
			.Where(cc => cc.User1Username == username || cc.User2Username == username)
			.GroupBy(cc => cc.User1Username == username ? cc.User2Username : cc.User1Username)
			.Select(group => group.OrderByDescending(cc => cc.Timestamp).First())
			.ToListAsync();

		var chatCardDtos = recentChats
			.Select(latestChat => new ChatCardDTO {
				ChatPartnerUsername = latestChat.User1Username == username
					? latestChat.User2Username
					: latestChat.User1Username,
				RecentMessage = latestChat.RecentMessage,
				Timestamp = latestChat.Timestamp
			});

		return chatCardDtos;
	}
}
