using System.ComponentModel.DataAnnotations;

namespace tired.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [MaxLength(255)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$",
        ErrorMessage = "Password must contain an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)")]
        public string Password { get; set; }
        public int? Level { get; set; }
        public int DisplayLevel
        {
            get { return Level ?? 1; } 
        }
        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(50)]
        public string? Handle { get; set; }

        [StringLength(255)]
        public string? AvatarUrl { get; set; }
    }
}