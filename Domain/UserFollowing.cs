namespace Domain
{
    public class UserFollowing
    {
        //Observer here refers to following a particular Target, nothing to do with MobX Observers
        public string ObserverId { get; set; }

        public AppUser Observer{get; set;}

        public string TargetId{get; set;}

        public AppUser Target { get; set; }
    }
}