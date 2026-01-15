using api_aspnet.src.Data;
using api_aspnet.src.Data.Seed;
using api_aspnet.src.Entities;
using api_aspnet.src.Extensions;
using api_aspnet.src.Middleware;
using api_aspnet.src.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(policy =>
    policy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins(
            "http://localhost:4200",
            "https://localhost:4200",
            "http://localhost",
            "https://localhost"
        )
);

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

var wwwroot = Path.Combine(app.Environment.ContentRootPath, "wwwroot");

if(Directory.Exists(wwwroot)) {
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapFallbackToController("Index", "Fallback");
} else {
    Console.WriteLine("wwwroot not found – running in API-only dev mode");
}

/* API + SignalR */
app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

/* Database seed */
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try {
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager);
    await Seed.SeedTrills(context);
} catch(Exception ex) {
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
