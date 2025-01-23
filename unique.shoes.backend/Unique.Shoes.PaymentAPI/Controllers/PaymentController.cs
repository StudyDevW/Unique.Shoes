using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using unique.shoes.middleware.Services;
using Unique.Shoes.Middleware.Broker.DTO;
using Unique.Shoes.Middleware.Database.DTO;
using Unique.Shoes.PaymentAPI.Model.Services;

namespace Unique.Shoes.PaymentAPI.Controllers
{
    [Route("api/Payment/")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IDatabaseService _database;
        private readonly IJwtService _jwt;
        private readonly ICacheService _cache;

        public PaymentController(IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _database = database;
            _jwt = jwt;
            _cache = cache;
        }

        [HttpGet("Check")]
        public async Task<IActionResult> HashCheckForPay([FromHeader] string hashPay)
        {
            try
            {
                if (_cache.CheckExistKeysStorage<MarketToPaymentMQ>($"rabbit_{hashPay}"))
                {
                    return Ok("hashPay существует");
                }

                return BadRequest("hashPay на запрос оплаты не существует");
            }
            catch (HttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }

            return BadRequest();
        }

        [HttpPost("CardPay")]
        public async Task<IActionResult> PayOrder([FromBody] Pay_Request dtoObj)
        {
            try
            {
                await _database.Pay(dtoObj.cardNumber, dtoObj.cvv, dtoObj.hashPay);
                return Ok($"Заказ {dtoObj.hashPay} оплачен!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

               
        }

    }
}
