using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using unique.shoes.middleware.Services;
using Unique.Shoes.MarketAPI.Model.DTO;
using Unique.Shoes.MarketAPI.Model.Services;
using Unique.Shoes.Middleware.JWT.DTO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;

namespace Unique.Shoes.MarketAPI.Controllers
{
    [Route("api/Feedback/")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IDatabaseService _database;
        private readonly IJwtService _jwt;
        private readonly HttpClient _httpClient;
        private readonly ICacheService _cache;

        public FeedbackController(HttpClient httpClient, IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _database = database;
            _jwt = jwt;
            _cache = cache;
            _httpClient = httpClient;
        }
        [HttpDelete("SendMessage/{userId}")]
        public async Task<IActionResult> DeleteMessages(int userId)
        {
            if (_cache.CheckExistKeysStorage<List<MessageArchive>>(userId, "feedback_storage"))
            {
                _cache.DeleteKeyFromStorage(userId, "feedback_storage");
                return Ok();
            }


            return BadRequest();
        }


        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpPost("SendMessage/User")]
        public async Task<IActionResult> SendMessageUserToManager([FromBody] string messageToSend)
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
                    if (validation.token_success.userRoles.Contains("User"))
                    {
                        if (_cache.CheckExistKeysStorage<List<MessageArchive>>(validation.token_success.Id, "feedback_storage"))
                        {
                            var messagesGet = _cache.GetKeyFromStorage<List<MessageArchive>>(validation.token_success.Id, "feedback_storage");

                            MessageArchive message = new MessageArchive()
                            {
                                sendTime = DateTime.UtcNow,
                                message = messageToSend,
                                userName = validation.token_success.userName,
                                user_role = "User"
                            };

                            messagesGet.Add(message);

                            _cache.WriteKeyInStorage(validation.token_success.Id, "feedback_storage", messagesGet, DateTime.UtcNow.AddDays(30));
                        }
                        else
                        {
                            //Если чата нету, то создаем
                            MessageArchive message = new MessageArchive()
                            {
                                sendTime = DateTime.UtcNow,
                                message = messageToSend,
                                userName = validation.token_success.userName,
                                user_role = "User"
                            };

                            _cache.WriteKeyInStorage(validation.token_success.Id, "feedback_storage", new List<MessageArchive>() { message }, DateTime.UtcNow.AddDays(30));
                        }
                    }
                    else
                    {
                        return BadRequest("Недопустимая роль");
                    }

                    return Ok("Сообщение отправлено");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpPost("SendMessage/Manager/{userId}")]
        public async Task<IActionResult> SendMessageManagerToUser(int userId, [FromBody] string messageToSend)
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
                    if (validation.token_success.userRoles.Contains("Manager"))
                    {
                        if (_cache.CheckExistKeysStorage<List<MessageArchive>>(userId, "feedback_storage"))
                        {
                            var messagesGet = _cache.GetKeyFromStorage<List<MessageArchive>>(userId, "feedback_storage");

                            MessageArchive message = new MessageArchive()
                            {
                                sendTime = DateTime.UtcNow,
                                message = messageToSend,
                                userName = validation.token_success.userName,
                                user_role = "Manager"
                            };

                            messagesGet.Add(message);

                            _cache.WriteKeyInStorage(userId, "feedback_storage", messagesGet, DateTime.UtcNow.AddDays(30));
                            return Ok("Сообщение отправлено");
                        }
                        else
                        {
                            //Если чата нету, то оповещаем
                            return BadRequest("Чата с этим пользователем не существует");
                        }
                    }
                    else
                    {
                        return BadRequest("Недопустимая роль");
                    }

             
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }


        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("GetMessages/{userId}")]
        public async Task<IActionResult> GetAllMessages(int userId)
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
                    if (validation.token_success.userRoles.Contains("Manager") || validation.token_success.Id == userId)
                    {
                        if (_cache.CheckExistKeysStorage<List<MessageArchive>>(userId, "feedback_storage"))
                        {
                            var messagesGet = _cache.GetKeyFromStorage<List<MessageArchive>>(userId, "feedback_storage");

                            return Ok(messagesGet);
                        }
                        else
                        {
                            //Если чата нету, то оповещаем
                            return BadRequest("Чата с этим пользователем не существует");
                        }
                    }

                    return Ok("Сообщение отправлено");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("GetMessages/UserMessages")]
        public async Task<IActionResult> GetAllMessages()
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
                    if (validation.token_success.userRoles.Contains("Manager"))
                    {
                        var request = new HttpRequestMessage(HttpMethod.Get, "http://unique.shoes.backend.accountapi:80/api/Accounts/ForManager");

                        request.Headers.Add("Authorization", bearer_key);

                        var response = await _httpClient.SendAsync(request);

                        if (response.StatusCode == HttpStatusCode.Unauthorized)
                            return Unauthorized();

                        if (response.StatusCode == HttpStatusCode.OK)
                        {
                            var jsonString = await response.Content.ReadAsStringAsync();

                            var idArray = JsonSerializer.Deserialize<List<int>>(jsonString);

                            List<MessagePreviews> messagesPrevs = new List<MessagePreviews>();

                            foreach (var idGetUser in idArray)
                            {
                                if (_cache.CheckExistKeysStorage<List<MessageArchive>>(idGetUser, "feedback_storage"))
                                {
                                    var messagesGet = _cache.GetKeyFromStorage<List<MessageArchive>>(idGetUser, "feedback_storage").Where(c => c.user_role == "User").LastOrDefault();

                                    if (messagesGet != null)
                                    {
                                        MessagePreviews preview = new MessagePreviews()
                                        {
                                            sendTime = messagesGet.sendTime,
                                            message = messagesGet.message,
                                            userId = idGetUser,
                                            userName = messagesGet.userName
                                        };

                                        messagesPrevs.Add(preview);
                                    }
                                }
                            }


                            return Ok(messagesPrevs);
                        }
                        else
                        {
                            //Если чата нету, то оповещаем
                            return BadRequest("Ошибка запроса на AccountAPI");
                        }
                    }
                    else
                    {
                        return BadRequest("Недопустимая роль");

                    }
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
