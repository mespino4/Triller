using api_aspnet.src.Entities;

namespace api_aspnet.src.Services.Interfaces;
public interface ITokenService {
	Task<string> CreateToken(AppUser user);
}