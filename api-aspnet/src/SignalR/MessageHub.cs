using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using api_aspnet.src.Extensions;
using api_aspnet.src.DTOs;

namespace api_aspnet.src.SignalR;

[Authorize]
public class MessageHub : Hub {
	private readonly IMessageRepository _messageRepository;
	private readonly IUserRepository _userRepository;
	private readonly IChatCardRepository _chatCardRepository;
	private readonly IMapper _mapper;

	public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository,
		IChatCardRepository chatCardRepository, IMapper mapper) {
		_messageRepository = messageRepository;
		_userRepository = userRepository;
		_chatCardRepository = chatCardRepository;
		_mapper = mapper;
	}

	public override async Task OnConnectedAsync() {
		var httpContext = Context.GetHttpContext();
		var otherUser = httpContext.Request.Query["user"];
		var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
		await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

		var messages = await _messageRepository
			.GetMessageThread(Context.User.GetUsername(), otherUser);

		await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
	}

	public override Task OnDisconnectedAsync(Exception exception) {
		return base.OnDisconnectedAsync(exception);
	}

	private string GetGroupName(string caller, string other) {
		var stringCompare = string.CompareOrdinal(caller, other) < 0;
		return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
	}

	public async Task SendMessage(CreateMessageDTO createMessageDto) {
		var username = Context.User.GetUsername();

		if(username == createMessageDto.RecipientUsername.ToLower())
			throw new HubException("You cannot send messages to yourself");

		var sender = await _userRepository.GetUserByUsernameAsync(username);
		var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

		if(recipient == null)
			throw new HubException("Recipient not found");

		var message = new Message {
			Sender = sender,
			Recipient = recipient,
			SenderUsername = username,
			RecipientUsername = recipient.UserName,
			Content = createMessageDto.Content
		};

		// Check if a ChatCard already exists
		var chatCard = await _chatCardRepository.GetChatCardAsync(username, recipient.UserName);
		if(chatCard == null) {
			// If no ChatCard exists, create a new one
			chatCard = new ChatCard {
				User1Username = username,
				User2Username = recipient.UserName,
				RecentMessage = createMessageDto.Content,
				Timestamp = DateTime.UtcNow
			};

			_chatCardRepository.AddChatCard(chatCard);

			if(!await _chatCardRepository.SaveAllAsync())
				throw new HubException("Failed to save chat card");

			// Now associate the ChatCard with the message
			message.ChatCardId = chatCard.Id;
		} else {
			// Update the existing ChatCard's timestamp
			chatCard.RecentMessage = createMessageDto.Content;
			chatCard.Timestamp = DateTime.UtcNow;

			if(!await _chatCardRepository.SaveAllAsync())
				throw new HubException("Failed to update chat card timestamp");

			// Associate the existing ChatCard with the message
			message.ChatCardId = chatCard.Id;
		}

		_messageRepository.AddMessage(message);

		if(await _messageRepository.SaveAllAsync()) {
			var group = GetGroupName(sender.UserName, recipient.UserName);
			await Clients.Group(group).SendAsync("NewMessage", _mapper.Map<MessageDTO>(message));
		} else
			throw new HubException("Failed to send message");

		//throw new HubException("Failed to send message");
	}
}