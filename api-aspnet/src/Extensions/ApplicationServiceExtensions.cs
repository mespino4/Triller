using api_aspnet.src.Data;
using api_aspnet.src.Data.Repositories;
using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Helpers;
using api_aspnet.src.Services.Interfaces;
using api_aspnet.src.Services;
using Microsoft.EntityFrameworkCore;
using api_aspnet.src.SignalR;

namespace api_aspnet.src.Extensions;

public static class ApplicationServiceExtensions {
	public static IServiceCollection AddApplicationServices(this IServiceCollection services,
		IConfiguration config) {
		services.AddDbContext<DataContext>(opt => {
			opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
		});

		services.AddCors();
		services.AddScoped<ITokenService, TokenService>();
		services.AddScoped<IUserRepository, UserRepository>();
		services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
		services.AddAutoMapper(typeof(AutoMapperProfiles));
		services.AddScoped<ITrillRepository, TrillRepository>();
		services.AddScoped<IBookmarkRepository, BookmarkRepository>();
		services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
		services.AddScoped<IMediaService, MediaService>();
		services.AddScoped<IMessageRepository, MessageRepository>();
		services.AddScoped<IChatCardRepository, ChatCardRepository>();
		services.AddScoped<IRetrillRepository, RetrillRepository>();
		services.AddScoped<IConnectionRepository, ConnectionRepository>();
		services.AddScoped<IBlockRepository, BlockRepository>();
		services.AddScoped<INotificationRepository, NotificationRepository>();
		services.AddSingleton<PresenceTracker>();
		services.AddSignalR();

		return services;
	}
}
