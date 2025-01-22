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

       

    }
}