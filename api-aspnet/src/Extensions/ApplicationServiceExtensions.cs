using api_aspnet.src.Data;
using api_aspnet.src.Data.Repositories;
using api_aspnet.src.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api_aspnet.src.Extensions;

public static class ApplicationServiceExtensions {
	public static IServiceCollection AddApplicationServices(this IServiceCollection services,
	IConfiguration config) {
		services.AddDbContext<DataContext>(opt => {
			opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
		});

		services.AddCors();
		services.AddScoped<IUserRepository, UserRepository>();
		services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


		return services;
	}
}
