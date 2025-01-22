using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
  
    public class ActivitiesController:BaseApiController
    {   /*The constructor is no longer needed since we're getting IMediator from the parent class as the Mediator property
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }*/

        [HttpGet] //api/activities
        //Passing a cancellation token allows the cancellation of the task in case the user closes the app/Postman or the connection times out etc
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id=id});
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            await Mediator.Send(new Create.Command{Activity=activity});
            return Ok();

            //This is the MediatR<12 implementation
            //return Ok(await Mediator.Send(new Create.Command{Activity=activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>EditActivity(Guid id,Activity activity)
        {
            activity.Id=id;
            await Mediator.Send(new Edit.Command{Activity=activity});
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            await Mediator.Send(new Delete.Command{Id=id});
            return Ok();
        }
    }
}