using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using api_aspnet.src.Extensions;

namespace api_aspnet.src.Controllers;

public class MessagesController(IUnitOfWork uow, IMapper mapper) : BaseApiController{
	private readonly IUnitOfWork _uow = uow;
	private readonly IMapper _mapper = mapper;

    [HttpPost]
	public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDto) {
		var username = User.GetUsername();
		if(username == createMessageDto.RecipientUsername.ToLower())
			return BadRequest("You cannot send messages to yourself");

		var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
		var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

		if(recipient == null) return BadRequest("Recipient not found");

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
				return BadRequest("Failed to save chat card");

			// Now associate the ChatCard with the message
			message.ChatCardId = chatCard.Id;
		} else {
			// Update the existing ChatCard's timestamp
			chatCard.RecentMessage = createMessageDto.Content;
			chatCard.Timestamp = DateTime.UtcNow;

			if(!await _uow.Complete())
				return BadRequest("Failed to update chat card timestamp");

			// Associate the existing ChatCard with the message
			message.ChatCardId = chatCard.Id;
		}
		_uow.MessageRepository.AddMessage(message);

		if(await _uow.Complete())
			return Ok(_mapper.Map<MessageDTO>(message));

		return BadRequest("Failed to send message");
	}

	[HttpDelete] //api//messages
	public async Task<ActionResult<MessageDTO>> RemoveMessage(int messageId) {
		var message = await _uow.MessageRepository.GetMessage(messageId);
		if(message == null) return BadRequest("Message not found");
		_uow.MessageRepository.DeleteMessage(message);

		if(await _uow.Complete())
			return Ok(_mapper.Map<MessageDTO>(message));

		return BadRequest("Failed to Delete message");
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery]
			MessageParams messageParams) {
		messageParams.Username = User.GetUsername();

		var messages = await _uow.MessageRepository.GetMessagesForUser(messageParams);

		Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize,
			messages.TotalCount, messages.TotalPages));

		return messages;
	}

	/*
	[HttpGet("thread/{username}")]
	public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username) {
		var currentUsername = User.GetUsername();
		var thread = await _uow.MessageRepository.GetMessageThread(currentUsername, username);

		//return Ok(_mapper.Map<IEnumerable<MessageDto>>(thread));
		return Ok(thread);
	}
	*/

	//this is to add a member to the users chatlist(the people they are chatting with)
	[HttpPost("inbox/{username}")]
	public async Task<ActionResult<ChatCardDTO>> Inbox(string username) {
		var sender = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sender == null) return BadRequest("sender not found");

		var recipient = await _uow.UserRepository.GetUserByUsernameAsync(username);
		if(recipient == null) return BadRequest("recipient not found");

		// Check if a ChatCard already exists
		var chatCard = await _uow.ChatCardRepository.GetChatCardAsync(username, recipient.UserName);

		if(chatCard == null) { // If no ChatCard exists,
			chatCard = new ChatCard { //create a new one
				User1Username = sender.UserName,
				User2Username = recipient.UserName,
				Timestamp = DateTime.UtcNow
			};
			_uow.ChatCardRepository.AddChatCard(chatCard);
		} else
			chatCard.Timestamp = DateTime.UtcNow; // Update the existing ChatCard's timestamp

		if(await _uow.Complete())
			return Ok(_mapper.Map<ChatCardDTO>(chatCard));

		return BadRequest("Failed to open inbox");
	}

	//this returns the chatlist
	[HttpGet("chats")]
	public async Task<ActionResult<IEnumerable<ChatCardDTO>>> GetRecentChats() {
		var username = User.GetUsername(); // Assuming you have a User.GetUsername() extension method or similar
		if(username == null) return BadRequest("User not found");

		var recentChats = await _uow.MessageRepository.GetRecentChats(username);
		return Ok(recentChats);
	}
}
