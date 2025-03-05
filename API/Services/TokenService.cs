using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
           _config = config;
        }
        public string CreateToken(AppUser user)
        {
            var claims= new List<Claim>
            {
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim(ClaimTypes.Email,user.Email),
            };
            //A symetric key is used to encrypt and decrypt, so it should never leave the server, in contrast to the asymmetric keys used in HTTPS/SSL,
            //These use a public and a private key

            //When using HmacSha512 algorithms, the key must be at least 64 characters long!
            var key= new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor=new SecurityTokenDescriptor
            {
                Subject=new ClaimsIdentity(claims),
                Expires=DateTime.UtcNow.AddDays(7),
                SigningCredentials=creds
            };

            var tokenHandler=new JwtSecurityTokenHandler();

            var token=tokenHandler.CreateToken(tokenDescriptor);
            //WriteToken serializes the JWT from CreateToken into JWE or JWS so it can be used by other methods
            return tokenHandler.WriteToken(token);

        }
    }
}