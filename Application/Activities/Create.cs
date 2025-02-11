
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command:IRequest<Result<Unit>>
        {
            public  Activity Activity{get;set;}
        }
        //To use these validators, instal the nuget Fluent Validation ASPNET.Core package AND add the corresponding services in the ServiceExtensions file
        public class CommandValidator:AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }

        }

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity);

                var result=await _context.SaveChangesAsync()>0;

                if(!result) return Result<Unit>.Failure("Activity creatings is no");

                return Result<Unit>.Success(Unit.Value);

                //If using MediatR<12 we need to return something here to implement IRequest: Task<Unit> Handle...
                //return Unit.Value
                
            }
        }
    }
    
}