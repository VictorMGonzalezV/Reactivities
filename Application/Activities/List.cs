using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Activities
{
    public class List
    {
        public class Query:IRequest<Result<List<ActivityDto>>>{}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context =context;
            
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken) 
            {
                /*These lines manually load the Attendees and then AppUser, which is related to Attendees,
                else returning the activities won't get the user and adding the logged in user as host isn't going to happen.
                Using Include can be cumbersome because it loads the all related data in the SQL query
                var activities=await _context.Activities
                .Include(a=>a.Attendees)
                .ThenInclude(u=>u.AppUser)
                .ToListAsync(cancellationToken);*/

                //Projecting the Activities into the ActivityDto's is much more efficient
                var activities=await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUsername=_userAccessor.GetUsername()})
                .ToListAsync(cancellationToken);

                //Using projection removes the need of this final mapping
                //var activitiesToReturn=_mapper.Map<List<ActivityDto>>(activities);
               
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}