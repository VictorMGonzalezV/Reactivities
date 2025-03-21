using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController:ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager,TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //FindBy methods don't work together with eager loading, so this needed to be changed
            //var user=await _userManager.FindByEmailAsync(loginDto.Email);

            var user=await _userManager.Users.Include(p=>p.Photos)
                .FirstOrDefaultAsync(x=>x.Email==loginDto.Email);

            if(user==null) return Unauthorized();

            var result=await _userManager.CheckPasswordAsync(user,loginDto.Password);
            if (result)
            {
                return CreateUserObject(user);
            }
            return Unauthorized();

        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x=>x.UserName==registerDto.Username))
            {
                ModelState.AddModelError("Username","Username already of existings, of findings new username plox");
                return ValidationProblem();
                //This works but doesn't provide a full error trace
                //return BadRequest(ModelState);
                //This causes errors if we're using Yup and validation error React components
                //return BadRequest("Somebody is of have same username, findings new plox);
            }

              if(await _userManager.Users.AnyAsync(x=>x.Email==registerDto.Email))
            {
                ModelState.AddModelError("Email","Email already of existings, of findings new mail plox");
                return ValidationProblem();
            }

            var user=new AppUser
            {
                DisplayName=registerDto.DisplayName,
                Email=registerDto.Email,
                UserName=registerDto.Username
            };

            var result=await _userManager.CreateAsync(user,registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);
            }
            return BadRequest(result.Errors);
        }


        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user=await _userManager.Users.Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Email==User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);

        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x=>x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName

            };
        }
    

    }
}