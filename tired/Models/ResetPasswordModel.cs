
namespace tired.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ResetPasswordModel
    {
        public int UserId { get; set; }
        public string Token { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$",
   ErrorMessage = "Password must contain an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password is required")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password and confirmation do not match")]
        public string ConfirmPassword { get; set; }

    }
}
