using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command:IRequest
        {
            public Activity Activity{get;set;}
        }

        public class Handler: IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var activity=await _context.Activities.FindAsync(request.Activity.Id);

                _mapper.Map(request.Activity,activity);
                
                //This syntax can be used if there's just one or two properties to update, in case the value coming in from the request is null, we simply set the existing value again
                //activity.Title=request.Activity.Title??activity.Title;

                await _context.SaveChangesAsync();
            }
        }
    }
}