using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



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
        public async Task<IActionResult> GetActivities([FromQuery]ActivityParams param)
        {
            //Console.WriteLine($"Request received");
            return HandlePagedResult(await Mediator.Send(new List.Query{Params=param}));
        }
        
        //Seeting the Task return type to IActionResult allows the use of HTTP response codes
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //Console.WriteLine($"Request received for ID: {id}");

            return HandleResult(await Mediator.Send(new Details.Query{Id=id}));

        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Activity=activity}));
          

            //This is the MediatR<12 implementation
            //return Ok(await Mediator.Send(new Create.Command{Activity=activity}));
        }
        [Authorize(Policy="IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult>EditActivity(Guid id,Activity activity)
        {
            activity.Id=id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity=activity}));
           
        }
        //[Authorize(Policy="IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id=id}));
            
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id=id}));
        }
    }
}