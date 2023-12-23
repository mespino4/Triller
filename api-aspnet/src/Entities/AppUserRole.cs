using Microsoft.AspNetCore.Identity;

namespace api_aspnet.src.Entities;

public class AppUserRole : IdentityUserRole<int> {
	public AppUser User { get; set; }
	public AppRole Role { get; set; }
}