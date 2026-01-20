using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using Profiles;

namespace API.Controllers
{
    public class ProfilesController:BaseApiController
    {
        /*Remember the template to write endpoints when using MediatR and CQRS
            [HttpVERB("route")]
    public async Task<IActionResult> MethodName(params)
    {
        return HandleResult(
            await Mediator.Send(
                MediatR sends either a query or a command, those are defined already in the file for Something
                new Something.QueryOrCommand { Params=paramsFromMethodCall }
            )
        );
    }*/

        
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Username=username}));

        }

        [HttpPut]
        
        public async Task<IActionResult> Edit(Edit.Command command)
        {
           return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetActivities(string username,string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query{Username=username,Predicate=predicate}));
        }
    }
}