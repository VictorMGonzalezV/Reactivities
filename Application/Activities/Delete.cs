
using System.Reflection.Metadata.Ecma335;
using Application.Core;
using MediatR;
using Persistence;
using SQLitePCL;

namespace Application.Activities
{
    public class Delete
    {
        private readonly DataContext context;

        public class Command:IRequest<Result<Unit>>
        {
            public Guid Id{get; set;}
        }

        public class Handler: IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public  Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request,CancellationToken cancellationToken)
        {
            var activity=await _context.Activities.FindAsync(request.Id);
            if(activity==null) return null;

            //Reminder: this removes the Activity from the virtual DOM (memory), SaveChangesAsync will remove it from the DB
            _context.Remove(activity);

            var result=await _context.SaveChangesAsync()>0;
            if(!result) return Result<Unit>.Failure("Cannot into delete activity");

            return Result<Unit>.Success(Unit.Value);
        }
        }
        
    }
}