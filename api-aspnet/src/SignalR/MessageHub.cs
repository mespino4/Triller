using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using api_aspnet.src.Extensions;
using api_aspnet.src.DTOs;

namespace api_aspnet.src.SignalR;

[Authorize]
public class MessageHub(IUnitOfWork uow, IMapper mapper) : Hub {
	private readonly IUnitOfWork _uow = uow;
	private readonly IMapper _mapper = mapper;

    public override async Task OnConnectedAsync() {
		var httpContext = Context.GetHttpContext();
		var otherUser = httpContext.Request.Query["user"];
		var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
		await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

		var messages = await _uow.MessageRepository
			.GetMessageThread(Context.User.GetUsername(), otherUser);

		if(_uow.HasChanges()) await _uow.Complete();

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

		var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
		var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

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
		var chatCard = await _uow.ChatCardRepository.GetChatCardAsync(username, recipient.UserName);
		if(chatCard == null) {
			// If no ChatCard exists, create a new one
			chatCard = new ChatCard {
				User1Username = username,
				User2Username = recipient.UserName,
				RecentMessage = createMessageDto.Content,
				Timestamp = DateTime.UtcNow
			};

			_uow.ChatCardRepository.AddChatCard(chatCard);

			if(!await _uow.Complete())
				throw new HubException("Failed to save chat card");

			// Now associate the ChatCard with the message
			message.ChatCardId = chatCard.Id;
		} else {
			// Update the existing ChatCard's timestamp
			chatCard.RecentMessage = createMessageDto.Content;
			chatCard.Timestamp = DateTime.UtcNow;

			if(!await _uow.Complete())
				throw new HubException("Failed to update chat card timestamp");

			// Associate the existing ChatCard with the message
			message.ChatCardId = chatCard.Id;
		}

		_uow.MessageRepository.AddMessage(message);

		if(await _uow.Complete()) {
			var group = GetGroupName(sender.UserName, recipient.UserName);
			await Clients.Group(group).SendAsync("NewMessage", _mapper.Map<MessageDTO>(message));
		} else
			throw new HubException("Failed to send message");

		//throw new HubException("Failed to send message");
	}
}