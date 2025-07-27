using System.ComponentModel.DataAnnotations;

namespace tired.Models
{
    public class PasswordToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [Required]
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsUsed { get; set; }
        public User User { get; set; }
    }
}

