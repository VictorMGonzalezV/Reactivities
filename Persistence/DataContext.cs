using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    /*What happens here is that IdentityDbContext has a default user entity bundled with it, <TUser>, but by adding your custom user class instead of the generic parameter, 
    the db context will use your custom user class, the custom user class MUST inherit from IdentityUser, which contains the functionality expected by IdentityDbContext*/
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities {get; set;}

       
    }
}