using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController:ControllerBase
    {
        private IMediator _mediator;

        //The ??= operator means if x==null do y. Here the controller requests the Mediator service in case _mediator is null
        protected IMediator Mediator=>_mediator??=HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result==null) return NotFound();
             if(result.IsSuccess&&result.Value!=null)
                return Ok(result.Value);
            if(result.IsSuccess&&result.Value==null)
                return NotFound();
            return BadRequest();
        }

       

    }
}