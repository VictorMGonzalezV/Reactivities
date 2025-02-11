using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command:IRequest<Result<Unit>>
        {
            public Activity Activity{get;set;}
        }

        //To use these validators, instal the nuget Fluent Validation ASPNET.Core package AND add the corresponding services in the ServiceExtensions file
        public class CommandValidator:AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }

        }

        public class Handler: IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity=await _context.Activities.FindAsync(request.Activity.Id);

                if (activity==null) return null;

                _mapper.Map(request.Activity,activity);
                
                //This syntax can be used if there's just one or two properties to update, in case the value coming in from the request is null, we simply set the existing value again
                //activity.Title=request.Activity.Title??activity.Title;

                var result=await _context.SaveChangesAsync()>0;

                if(!result) return Result<Unit>.Failure("Cannot into make update of activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}