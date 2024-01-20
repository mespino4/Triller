using api_aspnet.src.DTOs;
using api_aspnet.src.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json;

namespace api_aspnet.src.Data.Seed;

public class Seed {
	public static async Task SeedUsers(UserManager<AppUser> userManager,
		RoleManager<AppRole> roleManager) {
		if(await userManager.Users.AnyAsync()) return;

		var userData = await File.ReadAllTextAsync("src/Data/Seed/UserSeedData.json");
		var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
		var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

		var roles = new List<AppRole> {
			new AppRole{Name = "Member" },
			new AppRole{Name = "Admin" },
			new AppRole{Name = "Moderator" },
		};

		foreach(var role in roles)
			await roleManager.CreateAsync(role);

		foreach(var user in users) {
			user.UserName = user.UserName.ToLower();
			await userManager.CreateAsync(user, "Pa$$w0rd");
			await userManager.AddToRoleAsync(user, "Member");
		}

		var admin = new AppUser { UserName = "admin", DisplayName = "Admin", About = "im the admin"};
		await userManager.CreateAsync(admin, "Pa$$w0rd");
		await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
	}

	public static async Task SeedTrills(DataContext context) {
		if(!context.Trills.Any()) {
			var trillData = await File.ReadAllTextAsync("src/Data/Seed/TrillSeedData.json");
			var trills = JsonSerializer.Deserialize<List<Trill>>(trillData);
			context.Trills.AddRange(trills);
		}

		if(context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
	}
}
