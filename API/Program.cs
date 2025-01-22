using API.Extensions;
using Microsoft.EntityFrameworkCore;
using Persistence;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

//This is an extension method which adds all the required services in one fell swoop, instead of adding them one by one here in the Program class
builder.Services.AddApplicationServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline. Also called middleware
if (app.Environment.IsDevelopment())
{
   
    app.MapOpenApi();
}

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

//This using statement means the variable will be ddisposed of as soon as the code executes, instead of waiting for the garbage collector
using var scope=app.Services.CreateScope();
var services=scope.ServiceProvider;
try
{
    //This is equivalent to running the ef migrate command via CLI
    var context=services.GetRequiredService<DataContext>();
    //Since SeedData is asynchronous, Migrate must be called using await+Async version
    await context.Database.MigrateAsync();
    //SeedData is an asynchronous Task, so it needs await before calling it
    await Seed.SeedData(context);

}catch(Exception ex)
{
    var logger=services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"Migration is no");
}

app.Run();
