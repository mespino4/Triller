using api_aspnet.src.Entities;
using api_aspnet.src.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api_aspnet.src.Services;

public class TokenService : ITokenService {

	private readonly SymmetricSecurityKey _key;
	private readonly UserManager<AppUser> _userManager;

	// Constructor that takes IConfiguration as a parameter to initialize the SymmetricSecurityKey.
	public TokenService(IConfiguration config, UserManager<AppUser> userManager) {
		_key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
		_userManager = userManager;
	}

	// Method to create a JWT token for the provided user.
	public async Task<string> CreateToken(AppUser user) {
		// Create a list of claims for the token, including the user's username.
		var claims = new List<Claim>{
				new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
				new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
			};

		var roles = await _userManager.GetRolesAsync(user);
		claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

		// Create credentials for signing the token using the SymmetricSecurityKey.
		var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

		// Create a token descriptor with token-specific information, including claims, expiration, and signing credentials.
		var tokenDescriptor = new SecurityTokenDescriptor {
			Subject = new ClaimsIdentity(claims), // Claims to include in the token.
			Expires = DateTime.Now.AddDays(7), // Token expiration (7 days from now).
			SigningCredentials = creds // Signing credentials to secure the token.
		};

		var tokenHandler = new JwtSecurityTokenHandler();

		// Create a JWT token based on the token descriptor.
		var token = tokenHandler.CreateToken(tokenDescriptor);

		// Write the JWT token as a string.
		return tokenHandler.WriteToken(token);
	}
}