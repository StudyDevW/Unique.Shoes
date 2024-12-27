using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using unique.shoes.middleware.JWT.DTO.CheckUsers;
using unique.shoes.middleware.JWT.DTO.Token;

namespace unique.shoes.middleware.Services
{
    public interface IJwtService
    {
        public string JwtTokenCreation(Auth_CheckSuccess dtoObj);

        public string RefreshTokenCreation(Auth_CheckSuccess dtoObj);

        // public Task<JwtSecurityToken> RSAJwtValidation(string? token);

        public Task<Token_ValidProperties> AccessTokenValidation(string? bearerKey, string checkrole = "none");

        public Task<Token_ValidProperties> RefreshTokenValidation(string? bearerKey);
    }
}
