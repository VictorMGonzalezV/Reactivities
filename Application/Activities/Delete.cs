
using MediatR;
using Persistence;
using SQLitePCL;

namespace Application.Activities
{
    public class Delete
    {
        private readonly DataContext context;

        public class Command:IRequest
        {
            public Guid Id{get; set;}
        }

        public class Handler: IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public  Handler(DataContext context)
        {
            _context = context;
        }

        public async Task Handle(Command request,CancellationToken cancellationToken)
        {
            var activity=await _context.Activities.FindAsync(request.Id);

            //Reminder: this removes the Activity from the virtual DOM (memory), SaveChangesAsync will remove it from the DB
            _context.Remove(activity);

            await _context.SaveChangesAsync();
        }
        }
        
    }
}