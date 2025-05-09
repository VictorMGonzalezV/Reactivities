
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Persistence;

namespace Application.Core
{
    public class MappingProfiles: Profile
    {
       public MappingProfiles()
       {
            CreateMap<Activity,Activity>();
            CreateMap<Activity,ActivityDto>()
            .ForMember(d=>d.HostUsername,o=>o.MapFrom(s=>s.Attendees.FirstOrDefault(x=>x.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee,AttendeeDto>()
            .ForMember(d=>d.DisplayName,o=>o.MapFrom(s=>s.AppUser.DisplayName))
            .ForMember(d=>d.Username,o=>o.MapFrom(s=>s.AppUser.UserName))
            .ForMember(d=>d.Bio,o=>o.MapFrom(s=>s.AppUser.Bio))
            .ForMember(d=>d.Image,o=>o.MapFrom(s=>s.AppUser.Photos.FirstOrDefault(x=>x.IsMain).Url));
            CreateMap<AppUser,Profiles.Profile>()
            .ForMember(d=>d.Image,o=>o.MapFrom(s=>s.Photos.FirstOrDefault(x=>x.IsMain).Url));
            CreateMap<Comment,CommentDto>()
            .ForMember(d=>d.DisplayName,o=>o.MapFrom(s=>s.Author.DisplayName))
            .ForMember(d=>d.Username,o=>o.MapFrom(s=>s.Author.UserName))
            .ForMember(d=>d.Image,o=>o.MapFrom(s=>s.Author.Photos.FirstOrDefault(x=>x.IsMain).Url));
       }

       
    }
}