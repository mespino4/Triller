using Microsoft.AspNetCore.Identity;

namespace api_aspnet.src.Entities;

public class AppRole : IdentityRole<int> {
	public ICollection<AppUserRole> UserRoles { get; set; }
}