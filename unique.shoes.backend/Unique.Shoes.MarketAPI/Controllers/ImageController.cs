using Microsoft.AspNetCore.Mvc;
using System.Linq;
using unique.shoes.middleware.Services;
using Unique.Shoes.MarketAPI.Model.Services;

namespace Unique.Shoes.MarketAPI.Controllers
{

    [Route("api/Images/")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IDatabaseService _database;
        private readonly IJwtService _jwt;

        private readonly ICacheService _cache;

        public ImagesController(IDatabaseService database, IJwtService jwt, ICacheService cache, IConfiguration configuration)
        {
            _database = database;
            _jwt = jwt;
            _cache = cache;
        }


        [HttpPost("Upload")]
        public async Task<IActionResult> Upload([FromQuery] string itemName, List<IFormFile> fileMassive)
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
                    if (fileMassive == null || fileMassive.Count == 0)
                        return BadRequest("Нет файла для загрузки.");

                    List<string> paths = new List<string>();

                    foreach (var file in fileMassive)
                    {

                        var filePath = Path.GetFullPath("Uploads/" + file.FileName);

                        if (!Directory.Exists(Path.GetFullPath("Uploads/")))
                            Directory.CreateDirectory(Path.GetFullPath("Uploads/"));

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        paths.Add(filePath);
                    }

                    await _database.AddImages(paths.ToArray(), itemName);

                    return Ok();
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }

            return BadRequest();
        }

        [HttpGet("GetImage")]
        public async Task<IActionResult> GetImage([FromHeader] string filePath)
        {
        
            try
            {
         

                var file = new FileStream(filePath, FileMode.Open, FileAccess.Read);

                return File(file, "image/jpeg");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
