using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Data.Repositories;
using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using api_aspnet.src.Helpers;
using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using api_aspnet.src.Extensions;

namespace api_aspnet.src.Controllers;

public class MessagesController : BaseApiController{
	private readonly IUserRepository _userRepository;
	private readonly IMessageRepository _messageRepository;
	private readonly IChatCardRepository _chatCardRepository;
	private readonly IMapper _mapper;
	public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository,
		IChatCardRepository chatCardRepository, IMapper mapper) {
		_userRepository = userRepository;
		_messageRepository = messageRepository;
		_chatCardRepository = chatCardRepository;
		_mapper = mapper;
	}


	[HttpPost]
	public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDto) {
		var username = User.GetUsername();
		if(username == createMessageDto.RecipientUsername.ToLower())
			return BadRequest("You cannot send messages to yourself");

		var sender = await _userRepository.GetUserByUsernameAsync(username);
		var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

		if(recipient == null)
			return BadRequest("Recipient not found");

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
				return BadRequest("Failed to save chat card");

			// Now associate the ChatCard with the message
			message.ChatCardId = chatCard.Id;
		} else {
			// Update the existing ChatCard's timestamp
			chatCard.RecentMessage = createMessageDto.Content;
			chatCard.Timestamp = DateTime.UtcNow;

			if(!await _chatCardRepository.SaveAllAsync())
				return BadRequest("Failed to update chat card timestamp");

			// Associate the existing ChatCard with the message
			message.ChatCardId = chatCard.Id;
		}
		_messageRepository.AddMessage(message);

		if(await _messageRepository.SaveAllAsync())
			return Ok(_mapper.Map<MessageDTO>(message));

		return BadRequest("Failed to send message");
	}

	[HttpDelete] //api//messages
	public async Task<ActionResult<MessageDTO>> RemoveMessage(int messageId) {
		var message = await _messageRepository.GetMessage(messageId);
		if(message == null) return BadRequest("Message not found");
		_messageRepository.DeleteMessage(message);

		if(await _messageRepository.SaveAllAsync())
			return Ok(_mapper.Map<MessageDTO>(message));

		return BadRequest("Failed to Delete message");
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery]
			MessageParams messageParams) {
		messageParams.Username = User.GetUsername();

		var messages = await _messageRepository.GetMessagesForUser(messageParams);

		Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage, messages.PageSize,
			messages.TotalCount, messages.TotalPages));

		return messages;
	}

	[HttpGet("thread/{username}")]
	public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username) {
		var currentUsername = User.GetUsername();
		var thread = await _messageRepository.GetMessageThread(currentUsername, username);

		//return Ok(_mapper.Map<IEnumerable<MessageDto>>(thread));
		return Ok(thread);
	}

	//this is to add a member to the users chatlist(the people they are chatting with)
	[HttpPost("inbox/{username}")]
	public async Task<ActionResult<ChatCardDTO>> Inbox(string username) {
		var sender = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
		if(sender == null) return BadRequest("sender not found");

		var recipient = await _userRepository.GetUserByUsernameAsync(username);
		if(recipient == null) return BadRequest("recipient not found");

		// Check if a ChatCard already exists
		var chatCard = await _chatCardRepository.GetChatCardAsync(username, recipient.UserName);

		if(chatCard == null) { // If no ChatCard exists,
			chatCard = new ChatCard { //create a new one
				User1Username = sender.UserName,
				User2Username = recipient.UserName,
				Timestamp = DateTime.UtcNow
			};
			_chatCardRepository.AddChatCard(chatCard);
		} else
			chatCard.Timestamp = DateTime.UtcNow; // Update the existing ChatCard's timestamp

		if(await _chatCardRepository.SaveAllAsync())
			return Ok(_mapper.Map<ChatCardDTO>(chatCard));

		return BadRequest("Failed to open inbox");
	}

	//this returns the chatlist
	[HttpGet("chats")]
	public async Task<ActionResult<IEnumerable<ChatCardDTO>>> GetRecentChats() {
		var username = User.GetUsername(); // Assuming you have a User.GetUsername() extension method or similar
		if(username == null) return BadRequest("User not found");

		var recentChats = await _messageRepository.GetRecentChats(username);
		return Ok(recentChats);
	}
}
