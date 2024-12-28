using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using unique.shoes.middleware.JWT.DTO.CheckUsers;
using Unique.Shoes.Middleware.Database.DTO;
using Unique.Shoes.Middleware.Database.DTO.AccountSelect;

namespace Unique.Shoes.AccountAPI.Model.Services
{
    public interface IDatabaseService
    {
        public Auth_CheckInfo CheckUser(Auth_SignIn dto);

        public Task RegisterUser(Auth_SignUp dto);

        public Accounts_Info? InfoAccounts(int id);

        public Task UpdateAccount(Accounts_Update dto, int id);

        public Accounts_GetAll GetAllAccounts(int from, int count);

        public Task RegisterUserWithAdmin(Accounts_CreateUser dto);

        public Task UpdateAccountWithAdmin(Accounts_UpdateUser dto, int id);

        public Task DeleteAccountWithAdmin(int id);

    }
}
