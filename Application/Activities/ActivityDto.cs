using Application.Profiles;

namespace Application.Activities
{
    public class ActivityDto
    {
          //These property names are required by EF
        public Guid Id { get; set; }
        //Properties must be public and contain a getter and a setter for EF to work

        public string Title { get; set; }

        public DateTime Date{ get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }
        
        public string HostUsername {get; set;}

        public bool IsCancelled {get; set;}
        public ICollection<AttendeeDto> Attendees {get; set;}
    }
}