using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    //Extension methods should always be static
    public static class ApplicationServiceExtensions
    {
        //When calling this method from the extended class, only the config parameter needs to be supplied, by using "this" before the first parameter the method recognizes
        //that it's going to operate on the service collection it's got inside its own code.
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //Any further services the Program class may need to add later on, will be added here instead of in the Program class.
            services.AddOpenApi();
            services.AddDbContext<DataContext>(opt=> 
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt=>{
                opt.AddPolicy("CorsPolicy",policy=>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });

            });

            //This will register all handlers added to the Assembly,no need to register each individually
            services.AddMediatR(cfg=>cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;
        }
    }
}