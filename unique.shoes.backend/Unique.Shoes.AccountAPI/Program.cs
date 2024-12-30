using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Npgsql;
using System.Security.Cryptography;
using unique.shoes.middleware.Cache;
using unique.shoes.middleware.Database;
using unique.shoes.middleware.JWT;
using unique.shoes.middleware.Services;
using Unique.Shoes.AccountAPI.Model.Database;
using Unique.Shoes.AccountAPI.Model.Services;

namespace unique.shoes.backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            var securityScheme = new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Authorize accessToken",
            };

            var securityReq = new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            };

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(o =>
            {
                o.AddSecurityDefinition("Bearer", securityScheme);
                o.AddSecurityRequirement(securityReq);

                o.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Accounts API",
                    Description = "ASP.NET core, Practice",
                    Contact = new OpenApiContact
                    {
                        Name = "Sychenko Anton - Developer",
                        Url = new Uri("https://github.com/StudyDevW")
                    }
                });

                var basePath = AppContext.BaseDirectory;

               // var xmlPath = Path.Combine(basePath, "apidocs.xml");
               // o.IncludeXmlComments(xmlPath);
            });

            builder.Services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = "Asymmetric";
                o.DefaultChallengeScheme = "Asymmetric";
                o.DefaultScheme = "Asymmetric";

            }).AddJwtBearer("Asymmetric", o =>
            {
                var rsa = RSA.Create();

                var jwtSdk = new JwtSDK();

                rsa.ImportFromPem(jwtSdk.RSAPublicKey("JWT"));

                o.IncludeErrorDetails = true;
                o.RequireHttpsMetadata = false;
                o.SaveToken = false;

                TokenValidationParameters tk_valid = new TokenValidationParameters
                {
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new RsaSecurityKey(rsa),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    RequireSignedTokens = true,
                    ValidateLifetime = false,
                    RequireExpirationTime = false //#
                };

                o.TokenValidationParameters = tk_valid;
            });


            builder.Services.AddDbContext<DataContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("ServerConn"));
            });

            builder.Services.AddSingleton<IDatabaseService, DatabaseSDK>();

            builder.Services.AddSingleton<IJwtService, JwtSDK>();

            builder.Services.AddSingleton<ICacheService, CacheSDK>();

            //nginx 
            builder.Services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder => builder.WithOrigins("http://localhost:8081", "http://localhost:4000", "http://localhost")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader());
            });

            var app = builder.Build();

            await EnsureDatabaseInitializedAsync(app);

            app.UseCors("AllowOrigin");

            app.UseRouting();

            app.UseForwardedHeaders();

            app.UseAuthorization();

            app.UseAuthentication();

            app.MapControllers();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Accounts API");
                c.RoutePrefix = "ui-swagger";
            });

            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/")
                {
                    context.Response.Redirect("/ui-swagger/");
                }
                else
                {
                    await next();
                }
            });

            await app.RunAsync();
        }

        private static async Task<bool> CheckIfTableExistsAsync(DbContext context, string tableName)
        {
            var connection = (NpgsqlConnection)context.Database.GetDbConnection();
            await connection.OpenAsync();

            var exists = false;

            var command = new NpgsqlCommand(
                $"SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '{tableName}');",
                connection);

            exists = (bool)await command.ExecuteScalarAsync();

            await connection.CloseAsync();
            return exists;
        }

        private static async Task EnsureDatabaseInitializedAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();

            var tableNameFirst = "userTableObj";
            var tableNameSecond = "usersMoreTableObj";


            var tableExistsFirst = await CheckIfTableExistsAsync(context, tableNameFirst);

            var tableExistsSecond = await CheckIfTableExistsAsync(context, tableNameSecond);

            if (!tableExistsFirst && !tableExistsSecond)
            {
                await context.Database.MigrateAsync();
            }
        }
    }
}