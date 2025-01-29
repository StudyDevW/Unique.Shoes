namespace Unique.Shoes.MarketAPI.Model.DTO
{
    public class MessageArchive
    {
        public DateTime? sendTime { get; set; }

        //public DateTime? receiveTime { get; set;}

        public string userName { get; set; }

        public string message { get; set; }

        public string user_role { get; set; }
    }
}
