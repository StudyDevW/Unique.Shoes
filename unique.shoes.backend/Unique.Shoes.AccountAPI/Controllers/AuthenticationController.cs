﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using unique.shoes.middleware.JWT.DTO.CheckUsers;
using unique.shoes.middleware.Services;
using Unique.Shoes.AccountAPI.Model.Services;
using Unique.Shoes.Middleware.Database.DTO;
using Unique.Shoes.Middleware.JWT.DTO;

namespace Unique.Shoes.AccountAPI.Controllers
{
    [Route("api/Authentication/")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IDatabaseService _database;
        private readonly IJwtService _jwt;
        private readonly ICacheService _cache;
        private readonly ILogger _logger;

        public AuthenticationController(IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("AccountAPI | controller-logger");
            _database = database;
            _jwt = jwt;
            _cache = cache;
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp([FromBody] Auth_SignUp dtoObj)
        {
            try
            {
                await _database.RegisterUser(dtoObj);

                return Ok("account_created");
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("Sessions")]
        public async Task<IActionResult> CheckSessions()
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {

                if (_cache.CheckExistKeysStorage<List<Session_Init>>(validation.token_success.Id, "session_storage"))
                {
                    var sessions = _cache.GetKeyFromStorage<List<Session_Init>>(validation.token_success.Id, "session_storage");

                    return Ok(sessions);
                }
                    

            }

            return BadRequest();
        }


        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpDelete("Sessions")]
        public async Task<IActionResult> ClearSessions()
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {

                if (_cache.CheckExistKeysStorage<List<Session_Init>>(validation.token_success.Id, "session_storage"))
                {
                    _cache.DeleteKeyFromStorage(validation.token_success.Id, "session_storage");

                    return Ok("Успех");
                }
            }

            return BadRequest();
        }


        [HttpPost("SignIn")]
        public IActionResult SignIn([FromBody] Auth_SignIn dtoObj)
        {
            if (dtoObj.username == null)
                return BadRequest();

            var check = _database.CheckUser(dtoObj);

            if (check.CheckHasSuccess())
            {
                var accessToken = _jwt.JwtTokenCreation(check.check_success);
                var refreshToken = _jwt.RefreshTokenCreation(check.check_success);

                if (_cache.CheckExistKeysStorage(check.check_success.Id, "accessTokens"))
                    _cache.DeleteKeyFromStorage(check.check_success.Id, "accessTokens");

                if (_cache.CheckExistKeysStorage(check.check_success.Id, "refreshTokens"))
                    _cache.DeleteKeyFromStorage(check.check_success.Id, "refreshTokens");

                _cache.WriteKeyInStorage(check.check_success.Id, "accessTokens", accessToken, DateTime.UtcNow.AddMinutes(1));
                _cache.WriteKeyInStorage(check.check_success.Id, "refreshTokens", refreshToken, DateTime.UtcNow.AddDays(7));

                if (_cache.CheckExistKeysStorage<List<Session_Init>>(check.check_success.Id, "session_storage")) {
                    
                    var sessionList = _cache.GetKeyFromStorage<List<Session_Init>>(check.check_success.Id, "session_storage");

                    foreach (var session in sessionList)
                    {
                        if (session.statusSession == "active")
                        {
                            session.timeDel = DateTime.UtcNow;
                            session.statusSession = "expired";
                        }
                    }

                    sessionList.Add(new Session_Init()
                    {
                        timeAdd = DateTime.UtcNow,
                        statusSession = "active",
                        tokenSession = accessToken
                    });

                    _cache.WriteKeyInStorage(check.check_success.Id, "session_storage", sessionList, DateTime.UtcNow.AddDays(7));
                }
                else
                {
                    _cache.WriteKeyInStorage(check.check_success.Id, "session_storage", new List<Session_Init>()
                    {
                        new Session_Init()
                        {
                            timeAdd = DateTime.UtcNow,
                            statusSession = "active",
                            tokenSession = accessToken
                        }
                    }, DateTime.UtcNow.AddDays(7));
                }

                Auth_PairTokens pair_tokens = new Auth_PairTokens()
                {
                    accessToken = _cache.GetKeyFromStorage(check.check_success.Id, "accessTokens"),
                    refreshToken = _cache.GetKeyFromStorage(check.check_success.Id, "refreshTokens")
                };

                _logger.LogInformation($"Пользователь {dtoObj.username} успешно вошел!");

                return Ok(pair_tokens);
            }

            return NotFound();
        }


        [HttpGet("Validate")]
        public async Task<IActionResult> ValidateToken([Required][FromHeader(Name = "accessToken")] string? token)
        {
            if (token != null)
            {
                if (token.Contains("Bearer"))
                    return BadRequest("accessToken in this method must not contain word [Bearer]");
            }

            var validation = await _jwt.AccessTokenValidation("Bearer " + token);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {
                _logger.LogInformation($"Токен для id: {validation.token_success.Id} валид!");
                return Ok("valid");
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpPut("SignOut")]
        public async Task<IActionResult> SignOut()
        {
            string bearer_key = Request.Headers["Authorization"];

            var validation = await _jwt.AccessTokenValidation(bearer_key);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {
                if (_cache.CheckExistKeysStorage<List<Session_Init>>(validation.token_success.Id, "session_storage"))
                {
                    var sessionList = _cache.GetKeyFromStorage<List<Session_Init>>(validation.token_success.Id, "session_storage");

                    foreach (var session in sessionList)
                    {
                        if (session.statusSession == "active")
                        {
                            session.timeDel = DateTime.UtcNow;
                            session.statusSession = "expired";
                        }
                    }

                    _cache.WriteKeyInStorage(validation.token_success.Id, "session_storage", sessionList, DateTime.UtcNow.AddDays(7));
                }


                _cache.DeleteKeyFromStorage(validation.token_success.Id, "accessTokens");

                _cache.DeleteKeyFromStorage(validation.token_success.Id, "refreshTokens");

                _logger.LogInformation($"Пользователь id: {validation.token_success.Id} вышел!");

                return Ok($"{validation.token_success.Id}_is_logout");
            }

            return Unauthorized();
        }

        [HttpPost("Refresh")]
        public async Task<IActionResult> RefreshTokensPair([FromBody] Auth_Refresh dtoObj)
        {
            var validation = await _jwt.RefreshTokenValidation(dtoObj.refreshToken);

            if (validation.TokenHasError())
            {
                return Unauthorized();
            }
            else if (validation.TokenHasSuccess())
            {
                Auth_CheckSuccess authsuccess = new Auth_CheckSuccess()
                {
                    Id = validation.token_success.Id,
                    roles = validation.token_success.userRoles,
                    username = validation.token_success.userName
                };

                var accessToken = _jwt.JwtTokenCreation(authsuccess);
                var refreshToken = _jwt.RefreshTokenCreation(authsuccess);

                if (_cache.CheckExistKeysStorage<List<Session_Init>>(authsuccess.Id, "session_storage"))
                {
                    var sessionList = _cache.GetKeyFromStorage<List<Session_Init>>(authsuccess.Id, "session_storage");

                    foreach (var session in sessionList)
                    {
                        if (session.statusSession == "active")
                        {
                            session.timeUpd = DateTime.UtcNow;
                            session.tokenSession = accessToken;
                        }
                    }

                    _cache.WriteKeyInStorage(authsuccess.Id, "session_storage", sessionList, DateTime.UtcNow.AddDays(7));
                }


                if (_cache.CheckExistKeysStorage(authsuccess.Id, "accessTokens"))
                    _cache.DeleteKeyFromStorage(authsuccess.Id, "accessTokens");

                if (_cache.CheckExistKeysStorage(authsuccess.Id, "refreshTokens"))
                    _cache.DeleteKeyFromStorage(authsuccess.Id, "refreshTokens");


                _cache.WriteKeyInStorage(authsuccess.Id, "accessTokens", accessToken, DateTime.UtcNow.AddMinutes(1));
                _cache.WriteKeyInStorage(authsuccess.Id, "refreshTokens", refreshToken, DateTime.UtcNow.AddDays(7));

             

                Auth_PairTokens pair_tokens = new Auth_PairTokens()
                {
                    accessToken = _cache.GetKeyFromStorage(authsuccess.Id, "accessTokens"),
                    refreshToken = _cache.GetKeyFromStorage(authsuccess.Id, "refreshTokens")
                };


                _logger.LogInformation($"Токены для id: {validation.token_success.Id} обновлены!");

                return Ok(pair_tokens);
            }

            return Unauthorized();
        }

    }
}
