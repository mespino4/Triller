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
	}
}
