using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using unique.shoes.middleware.Services;
using Unique.Shoes.MarketAPI.Model.Services;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Database.DTO;
using Unique.Shoes.Middleware.Services;

namespace Unique.Shoes.MarketAPI.Controllers
{
    [Route("api/Order/")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IDatabaseService _database;

        private readonly IJwtService _jwt;
        private readonly ICacheService _cache;
        private readonly ILogger _logger;

        public OrderController(IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("MarketAPI | controller-logger");
            _database = database;
            _jwt = jwt;
            _cache = cache;
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpPost("Pay")]
        public async Task<IActionResult> PayInit([FromBody] Pay_Order dtoObj)
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
                    await _database.AddOrderUser(dtoObj);

                    return Ok();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("Check")]
        public async Task<IActionResult> HashCheck([FromHeader] string hashPay)
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
                    if (_cache.CheckExistKeysStorage<PaymentToMarketMQ>($"rabbit_response_{hashPay}"))
                    {
                        var responseHash = _cache.GetKeyFromStorage<PaymentToMarketMQ>($"rabbit_response_{hashPay}");

                        if (responseHash.payStatus == "success")
                        {
                            await _database.OrderFinal(responseHash.hashPay);

                            _logger.LogInformation($"Заказ {responseHash.hashPay} отмечен как оплаченный");

                            _cache.DeleteKeyFromStorage($"rabbit_response_{hashPay}");

                            _logger.LogInformation($"Запись {responseHash.hashPay} удалена из кэша");

                            return Ok();
                        }

                    }

                    return BadRequest();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return BadRequest();

        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetAllOrders(int userId)
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
                    return Ok(_database.OrderAll(userId));
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return BadRequest();
        }

    }
}
