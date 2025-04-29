using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub:Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        //Make sure to import Application.Comments to get the appropriate Create handler
        public async Task SendComment(Create.Command command)
        {
            var comment =await _mediator.Send(command);

            //This sends the comment to all clients connected to the Hub AND are part of the Group whose name matches the ActivityId
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment",comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext= Context.GetHttpContext();
            var activityId=httpContext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId,activityId);
            var result= await _mediator.Send(new List.Query{ActivityId=Guid.Parse(activityId)});
            await Clients.Caller.SendAsync("LoadComments", result.Value);

        }

    }
}