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
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params{ get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
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

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken) 
            {
                /*These lines manually load the Attendees and then AppUser, which is related to Attendees,
                else returning the activities won't get the user and adding the logged in user as host isn't going to happen.
                Using Include can be cumbersome because it loads the all related data in the SQL query
                var activities=await _context.Activities
                .Include(a=>a.Attendees)
                .ThenInclude(u=>u.AppUser)
                .ToListAsync(cancellationToken);*/

                //Projecting the Activities into the ActivityDto's is much more efficient
                var query=_context.Activities
                .Where(d=>d.Date>=request.Params.StartDate)
                .OrderBy(d=>d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUsername=_userAccessor.GetUsername()})
                .AsQueryable();

                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query=query.Where(x=>x.Attendees.Any(a=>a.Username==_userAccessor.GetUsername()));
                }

                if(request.Params.IsHost && !request.Params.IsGoing)
                {
                    query=query.Where(x=>x.HostUsername==_userAccessor.GetUsername());
                }

                //Using projection removes the need of this final mapping
                //var activitiesToReturn=_mapper.Map<List<ActivityDto>>(activities);
               
                return Result<PagedList<ActivityDto>>.Success(await PagedList<ActivityDto>.CreateAsync(query,
                request.Params.pageNumber,request.Params.PageSize));
            }
        }
    }
}