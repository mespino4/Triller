using api_aspnet.src.Data;
using api_aspnet.src.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace api_aspnet.src.Extensions;

public static class IdentityServiceExtensions {
	public static IServiceCollection AddIdentityServices(this IServiceCollection services,
		IConfiguration config) {

		services.AddIdentityCore<AppUser>(opt => {
			opt.Password.RequireNonAlphanumeric = false;
			opt.Password.RequiredLength = 4;
			opt.Password.RequireLowercase = false;
			opt.Password.RequireUppercase = false;
			opt.Password.RequireDigit = false;
		})
			.AddRoles<AppRole>()
			.AddRoleManager<RoleManager<AppRole>>()
			.AddEntityFrameworkStores<DataContext>();

		services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
		.AddJwtBearer(options => {
			options.TokenValidationParameters = new TokenValidationParameters {
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
				ValidateIssuer = false,
				ValidateAudience = false
			};

			options.Events = new JwtBearerEvents {
				OnMessageReceived = context => {
					var accessToken = context.Request.Query["access_token"];

					var path = context.HttpContext.Request.Path;
					if(!string.IsNullOrEmpty(accessToken) &&
						path.StartsWithSegments("/hubs")) {
						context.Token = accessToken;
					}
					return Task.CompletedTask;
				}
			};
		});

		services.AddAuthorization(opt => {
			opt.AddPolicy("RequireAdminRole", policy => policy
				.RequireRole("Admin"));
			opt.AddPolicy("ModeratePhotoRole", policy => policy
				.RequireRole("Admin", "Moderator"));
		});

		return services;
	}

}
