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
        //We create a DbSet for each table we may want to query on its own, without making a JOIN query to access some of its information from another table

        public DbSet<Activity> Activities {get; set;}

        public DbSet<ActivityAttendee> ActivityAttendees{get; set;}

        public DbSet<Photo> Photos{get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //Here we create a new Key combining the app user and activity id's, this way each attendee+activity combination has a unique ID
            builder.Entity<ActivityAttendee>(x=>x.HasKey(aa=>new{aa.AppUserId,aa.ActivityId}));
            //The lambda expressions here are not anonymous functions, nothing is being returned, EF uses lambda expressions to define relationships
            //The different placeholders in the 1st and 3rd lambda expressions are there for readability, they refer to the same entity
            builder.Entity<ActivityAttendee>()
            .HasOne(u=>u.AppUser)
            .WithMany(a=>a.Activities)
            .HasForeignKey(aa=>aa.AppUserId);

             builder.Entity<ActivityAttendee>()
            .HasOne(u=>u.Activity)
            .WithMany(a=>a.Attendees)
            .HasForeignKey(aa=>aa.ActivityId);
        }


    }
}