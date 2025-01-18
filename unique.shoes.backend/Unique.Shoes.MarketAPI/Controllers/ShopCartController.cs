using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using unique.shoes.middleware.Services;
using Unique.Shoes.MarketAPI.Model.Services;
using Unique.Shoes.Middleware.Database.DTO;

namespace Unique.Shoes.MarketAPI.Controllers
{
    [Route("api/ShopCart/")]
    [ApiController]
    public class ShopCartController : ControllerBase
    {
        private readonly IDatabaseService _database;
        private readonly IJwtService _jwt;

        private readonly ICacheService _cache;

        public ShopCartController(IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _database = database;
            _jwt = jwt;
            _cache = cache;
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] ShopCart_Add dtoObj)
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
                    await _database.AddItemShopCart(dtoObj);
                    return Ok("item_added_to_cart");
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("All")]
        public async Task<IActionResult> GetAllItems([FromQuery]int userId)
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
                    return Ok(_database.GetShopCartItems(userId));
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpGet("Exist")]
        public async Task<IActionResult> GetCartItem([FromQuery] int userId, [FromQuery] string hashName)
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
                    if (_database.ExistItemShopCart(hashName, userId))
                    {
                        return Ok("item_exist");
                    }
                    else
                    {
                        return Ok("item_not_exist");
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
        [HttpPut("{id}")] //id записи корзины
        public async Task<IActionResult> ChangeItem(int id, [FromBody] ShopCart_Change dtoObj)
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
                    await _database.ChangeItemShopCart(id, dtoObj);
                    return Ok("item_changed");
                }
                catch (Exception e)
                {
                    return BadRequest();
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = "Asymmetric")]
        [HttpDelete("{id}")] //id записи корзины
        public async Task<IActionResult> DeleteItem(int id)
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
                    await _database.DeleteItemShopCart(id);
                    return Ok("item_deleted");
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
