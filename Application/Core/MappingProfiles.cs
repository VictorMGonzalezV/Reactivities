
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
       }

       
    }
}