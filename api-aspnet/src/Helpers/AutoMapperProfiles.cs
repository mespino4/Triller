using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using AutoMapper;

namespace api_aspnet.src.Helpers;

public class AutoMapperProfiles : Profile {
	public AutoMapperProfiles() {
		CreateMap<AppUser, MemberDTO>()
			.ForMember(dest => dest.TrillCount, opt => opt.MapFrom(src => src.Trills.Count))
			.ForMember(dest => dest.FollowerCount, opt => opt.MapFrom(src => src.Followers.Count))
			.ForMember(dest => dest.FollowingCount, opt => opt.MapFrom(src => src.Following.Count));
		
		CreateMap<MemberUpdateDTO, AppUser>();

		CreateMap<RegisterDTO, AppUser>();

		CreateMap<Trill, TrillDTO>()
			.ForMember(dest => dest.Likes, opt => opt.MapFrom(src => src.Likes.Count))
			.ForMember(dest => dest.Retrills, opt => opt.MapFrom(src => src.Retrills.Count))
			.ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.Timestamp))
			.ForMember(dest => dest.Replies, opt => opt.MapFrom(src => src.Replies));

		CreateMap<Retrill, TrillDTO>() // Create a separate mapping for Retrill to TrillDto
			.ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.CreatedAt));

		CreateMap<TrillReply, TrillReplyDTO>()
			.ForMember(dest => dest.Likes, opt => opt
				.MapFrom(src => src.Reactions.Count(r => r.ReactionType == ReactionType.Like)))
			.ForMember(dest => dest.Dislikes, opt => opt
				.MapFrom(src => src.Reactions.Count(r => r.ReactionType == ReactionType.Dislike)))
			.ForMember(dest => dest.Timestamp, opt => opt
				.MapFrom(src => src.Timestamp));

		//CreateMap<Bookmark, BookmarkDTO>();

		CreateMap<Message, MessageDTO>()
			.ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src =>
				src.Sender.ProfilePic.ToString()))
			.ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(src =>
				src.Recipient.ProfilePic.ToString()));

		CreateMap<ChatCard, ChatCardDTO>();

		CreateMap<Notification, NotificationDTO>();
		
	}
}
