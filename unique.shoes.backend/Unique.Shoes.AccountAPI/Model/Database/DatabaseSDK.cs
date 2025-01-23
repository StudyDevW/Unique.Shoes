using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using unique.shoes.middleware.Database.DBO;
using Unique.Shoes.Middleware.Database.DTO.AccountSelect;
using Unique.Shoes.Middleware.Database.DTO;
using unique.shoes.middleware.JWT.DTO.CheckUsers;
using Unique.Shoes.AccountAPI.Model.Services;
using Unique.Shoes.Middleware.Database.DBO;

namespace Unique.Shoes.AccountAPI.Model.Database
{
    public class DatabaseSDK : IDatabaseService
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _conf;

        public DatabaseSDK(IConfiguration configuration)
        {
            _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("AccountAPI | database-sdk-logger");
            _conf = configuration;

        }

        private int GetIdFromUsername(string? userName, DataContext _db)
        {

            var userCheck = _db.userTableObj.Where(c => c.username == userName).FirstOrDefault();

            if (userCheck != null)
            {
                return userCheck.id;
            }

            return -1;
        }

        public async Task RegisterWithMore(int userId, DataContext _db)
        {
            UsersMoreTable usersMoreTable = new UsersMoreTable()
            {
                userId = userId,
                avatarLink = "../images/def_user.png",
                countOrders = 0,
                phoneNumber = ""
            };

            _db.userMoreTableObj.Add(usersMoreTable);
            await _db.SaveChangesAsync();
        }

        public async Task RegisterUser(Auth_SignUp dto)
        {
            if (dto == null)
            {
                _logger.LogError("RegisterUser: dto==null");
                return;
            }

            string[] roles_user = new[] { "User" };

            UsersTable usersTable = new UsersTable()
            {
                firstName = dto.firstName,
                lastName = dto.lastName,
                password = dto.password,
                username = dto.username,
                roles = roles_user
            };

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                db.userTableObj.Add(usersTable);
                await db.SaveChangesAsync();

                var idRegisteredUser = GetIdFromUsername(dto.username, db);

                await RegisterWithMore(idRegisteredUser, db);

                _logger.LogInformation($"RegisterUser: {dto.username}, создан");
            }
            
            return;
        }

        public async Task RegisterUserWithAdmin(Accounts_CreateUser dto)
        {
            if (dto == null)
            {
                _logger.LogError("RegisterUser: dto==null");
                return;
            }

            UsersTable usersTable = new UsersTable()
            {
                firstName = dto.firstName,
                lastName = dto.lastName,
                password = dto.password,
                username = dto.username,
                roles = dto.roles.ToArray()
            };

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                db.userTableObj.Add(usersTable);
                await db.SaveChangesAsync();

                _logger.LogInformation($"RegisterUserWithAdmin: {dto.username}, создан");
            }

            return;
        }

        public Auth_CheckInfo CheckUser(Auth_SignIn dto)
        {
            if (dto == null)
            {
                _logger.LogError("CheckUser: dto==null");
                return new Auth_CheckInfo() { check_error = new Auth_CheckError { errorLog = "input_incorrect" } };
            }

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                foreach (var obj in db.userTableObj)
                {
                    if (obj.username == dto.username &&
                        obj.password == dto.password)
                    {
                        _logger.LogInformation($"CheckUser: Пользователь успешно вошел (username: {dto.username})");

                        return new Auth_CheckInfo()
                        {
                            check_success = new Auth_CheckSuccess
                            {
                                Id = obj.id,
                                username = obj.username,
                                roles = obj.roles.ToList()
                            }
                        };
                    }
                }
            }

            _logger.LogError("CheckUser: Пользователь ввел неверно имя или пароль!");
            return new Auth_CheckInfo() { check_error = new Auth_CheckError { errorLog = "username/password_incorrect" } };
        }

        public Accounts_Info? InfoAccounts(int id)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var selectedAcc = db.userTableObj.Where(c => c.id == id).FirstOrDefault();

                if (selectedAcc != null)
                {
                    _logger.LogInformation($"InfoAccounts: Запрошена информация о аккаунте (id: {id})");

                    return new Accounts_Info()
                    {
                        id = selectedAcc.id,
                        firstName = selectedAcc.firstName,
                        lastName = selectedAcc.lastName,
                        roles = selectedAcc.roles.ToList()
                    };
                }
            }

            return null;
        }

        public async Task UpdateAccount(Accounts_Update dto, int id)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var userToChange = db.userTableObj.Where(c => c.id == id).FirstOrDefault();

                if (userToChange != null)
                {
                    if (userToChange.lastName != dto.lastName)
                    {
                        userToChange.lastName = dto.lastName;
                        await db.SaveChangesAsync();

                        _logger.LogInformation($"UpdateAccount: (id: {id} ) lastname изменен");
                    }

                    if (userToChange.firstName != dto.firstName)
                    {
                        userToChange.firstName = dto.firstName;
                        await db.SaveChangesAsync();

                        _logger.LogInformation($"UpdateAccount: (id: {id} ) firstName изменен");
                    }

                    //Пароль не логирую
                    if (userToChange.password != dto.password)
                    {
                        userToChange.password = dto.password;
                        await db.SaveChangesAsync();
                    }
                }
            }
        }

        public async Task UpdateAccountWithAdmin(Accounts_UpdateUser dto, int id)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var userToChange = db.userTableObj.Where(c => c.id == id).FirstOrDefault();

                if (userToChange != null)
                {
                    if (userToChange.lastName != dto.lastName)
                    {
                        userToChange.lastName = dto.lastName;
                        await db.SaveChangesAsync();

                        _logger.LogInformation($"UpdateAccountWithAdmin: (id: {id} ) lastname изменен");
                    }


                    if (userToChange.firstName != dto.firstName)
                    {
                        userToChange.firstName = dto.firstName;
                        await db.SaveChangesAsync();


                        _logger.LogInformation($"UpdateAccountWithAdmin: (id: {id} ) firstname изменен");
                    }

                    if (userToChange.username != dto.username)
                    {
                        userToChange.username = dto.username;
                        await db.SaveChangesAsync();

                        _logger.LogInformation($"UpdateAccountWithAdmin: (id: {id} ) username изменен");
                    }
  

                    if (userToChange.password != dto.password)
                    {
                        userToChange.password = dto.password;
                        await db.SaveChangesAsync();
                    }

                    if (userToChange.roles.ToList() != dto.roles)
                    {
                        userToChange.roles = dto.roles.ToArray();
                        await db.SaveChangesAsync();

                        _logger.LogInformation($"UpdateAccountWithAdmin: (id: {id} ) roles изменены");
                    }
                }
            }
        }

        public async Task DeleteAccountWithAdmin(int id)
        {
            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                var userToChange = db.userTableObj.Where(c => c.id == id).FirstOrDefault();

                if (userToChange != null)
                {
                    db.userTableObj.Remove(userToChange);
                    await db.SaveChangesAsync();

                    _logger.LogInformation($"DeleteAccountWithAdmin: (id: {id} ) был удален");
                }
            }
        }

        public Accounts_GetAll GetAllAccounts(int _from, int _count)
        {
            Accounts_GetAll allAccounts = new Accounts_GetAll();

            allAccounts.Settings = new Accounts_SelectionSettings { from = _from, count = _count };
            //allAccounts.Content.Add(new Accounts_Info() { id = 0 });

            List<Accounts_Info> accounts = new List<Accounts_Info>();

            using (DataContext db = new DataContext(_conf.GetConnectionString("ServerConn")))
            {
                if (_count != 0)
                {
                    var filtered_query = db.userTableObj.Skip(_from).Take(_count);

                    foreach (var account in filtered_query)
                    {
                        Accounts_Info accountInfo = new Accounts_Info()
                        {
                            id = account.id,
                            firstName = account.firstName,
                            lastName = account.lastName,
                            roles = account.roles.ToList()
                        };

                        accounts.Add(accountInfo);
                    }
                }
                else
                {
                    var filtered_query = db.userTableObj.Skip(_from);

                    foreach (var account in filtered_query)
                    {
                        Accounts_Info accountInfo = new Accounts_Info()
                        {
                            id = account.id,
                            firstName = account.firstName,
                            lastName = account.lastName,
                            roles = account.roles.ToList()
                        };

                        accounts.Add(accountInfo);
                    }
                }
            }

            allAccounts.ContentFill(accounts);

            _logger.LogInformation($"GetAllAccounts: запрошены аккаунты");

            return allAccounts;
        }

    }

}