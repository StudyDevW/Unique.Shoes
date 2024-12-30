using Microsoft.AspNetCore.Mvc;
using Unique.Shoes.AccountAPI.Model.Services;
using unique.shoes.middleware.Services;
using Microsoft.AspNetCore.Authorization;
using Unique.Shoes.Middleware.Database.DTO;

namespace Unique.Shoes.AccountAPI.Controllers
{
    [Route("api/Accounts/")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IDatabaseService _database;
        private readonly IJwtService _jwt;

        private readonly ICacheService _cache;

        public AccountsController(IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _database = database;
            _jwt = jwt;
            _cache = cache;
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("Me")]
        public async Task<IActionResult> GetProfileOfUser()
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {
                var info_user = _database.InfoAccounts(validation.token_success.Id);

                if (info_user != null)
                    return Ok(info_user);
                else
                    return BadRequest("account_not_found");
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateAccount([FromBody] Accounts_Update dtoObj)
        {

            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {
                try
                {
                    await _database.UpdateAccount(dtoObj, validation.token_success.Id);
                    return Ok("account_updated");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int from, [FromQuery] int count)
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key, "Admin");

            if (validation.TokenHasError())
            {
                return Unauthorized(validation.token_error.errorLog);
            }
            else if (validation.TokenHasSuccess())
            {
                return Ok(_database.GetAllAccounts(from, count));
            }


            return BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserWithAdmin([FromBody] Accounts_CreateUser dtoObj)
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key, "Admin");

            if (validation.TokenHasError())
            {
                return Unauthorized(validation.token_error.errorLog);
            }
            else if (validation.TokenHasSuccess())
            {
                try
                {
                    await _database.RegisterUserWithAdmin(dtoObj);
                    return Ok($"account_created");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccountWithAdmin(int id, [FromBody] Accounts_UpdateUser dtoObj)
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key, "Admin");

            if (validation.TokenHasError())
            {
                return Unauthorized(validation.token_error.errorLog);
            }
            else if (validation.TokenHasSuccess())
            {
                try
                {
                    await _database.UpdateAccountWithAdmin(dtoObj, id);
                    return Ok($"account_changed");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccountWithAdmin(int id)
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key, "Admin");

            if (validation.TokenHasError())
            {
                return Unauthorized(validation.token_error.errorLog);
            }
            else if (validation.TokenHasSuccess())
            {
                try
                {
                    await _database.DeleteAccountWithAdmin(id);
                    return Ok($"account_deleted");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }


            return BadRequest();
        }

    }
}
