using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace tired.Models
{
    public class EditProfileModel
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public string? Email { get; set; }
        [Phone]
        public string? Phone { get; set; }

        [StringLength(50)]
        public string? Handle { get; set; }

        public IFormFile? Avatar { get; set; }

        public string? AvatarUrl { get; set; }

        [DataType(DataType.Password)]
        public string? OldPassword { get; set; }

        [DataType(DataType.Password)]
        public string? NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }
    }
}