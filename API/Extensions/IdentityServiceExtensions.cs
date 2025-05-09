using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions

{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt=>
            {
                opt.Password.RequireLowercase=false;
                opt.User.RequireUniqueEmail=true;
            })
            .AddEntityFrameworkStores<DataContext>();

            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            /*THIS DOESN'T WORK ON .NET >9
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt=>
            {
                opt.TokenValidationParameters=new TokenValidationParameters
                {
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey=key,
                    ValidateIssuer=false,
                    ValidateAudience=false
                };
            });*/

           //In .NET >9 we need to explicitly sett a DefaultScheme and a DefaultChallengeScheme in the options
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                //This block handles authentication to SignalR
                opt.Events= new JwtBearerEvents
                {
                    OnMessageReceived=context=>
                    {
                        var accessToken=context.Request.Query["access_token"];
                        var path=context.HttpContext.Request.Path;
                        if(!string.IsNullOrEmpty(accessToken)&&(path.StartsWithSegments("/chat")))
                        {
                            context.Token=accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization(opt=>
            {
                opt.AddPolicy("IsActivityHost",policy=>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler,IsHostRequirementHandler>();


            //AddScoped means the token service will be available while the HTTP request is running, there's also AddTransient=for a specific method and AddSingleton=while the app is running
            services.AddScoped<TokenService>();

            return services;
        }
    }
}