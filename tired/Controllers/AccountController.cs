using Microsoft.AspNetCore.Mvc;
using tired.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using tired.Services;

namespace ICPC_Project.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;
        private readonly tired.Services.ICustomEmailSender _emailSender;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ILogger<AccountController> _logger;

        public AccountController(AppDbContext context, tired.Services.ICustomEmailSender emailSender, IPasswordHasher<User> passwordHasher, ILogger<AccountController> logger)
        {
            _context = context;
            _emailSender = emailSender;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }
        private void SetCurrentUserLevelInViewBag()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId.HasValue)
            {
                var user = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == userId.Value);
                if (user != null)
                {
                    ViewBag.CurrentUserLevel = user.Level ?? 1;
                }
                else
                {
                    ViewBag.CurrentUserLevel = 1;
                }
            }
            else
            {
                ViewBag.CurrentUserLevel = 1;
            }
        }
      
        public IActionResult User(string mode = "login")
        {
            ViewBag.Mode = mode.ToLower();
            return View();
        }

        public IActionResult Signup2()
        {
            return View("Signup2");
        }

        public IActionResult Login()
        {
            ViewBag.Mode = "login";
            return View();
        }
        [HttpPost]
        public IActionResult Signup2(User user)
        {
            ViewBag.Mode = "signup";
            if (ModelState.IsValid)
            {
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email.ToLower());
                if (existingUser != null)
                {
                    ViewBag.Mode = "signup";
                    ModelState.AddModelError("Email", "This email is already in use. Please log in instead.");
                    return View("User", user);
                }

                var hasher = new PasswordHasher<User>();
                user.Email = user.Email.ToLower();
                user.Password = hasher.HashPassword(user, user.Password);
                user.Level ??= 1;
                _context.Users.Add(user);
                _context.SaveChanges();

               
                HttpContext.Session.SetInt32("UserId", user.Id);
                return RedirectToAction("Frist", "Home");
            }
            ModelState.AddModelError("", "Please fill in all required fields correctly.");
            ViewBag.Mode = "signup";
            return View("User", user); 
        }
        //
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View(new ForgotPasswordModel());
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (user != null)
                {
                    var token = Guid.NewGuid().ToString();
                    var resetToken = new PasswordToken
                    {
                        UserId = user.Id,
                        Token = token,
                        ExpiryDate = DateTime.UtcNow.AddHours(1),
                        IsUsed = false
                    };
                    _context.PasswordTokens.Add(resetToken);
                    await _context.SaveChangesAsync();

                    var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, token }, protocol: Request.Scheme);
                    await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                        $"This link can only be used once, Please reset your password by clicking here: <a href='{callbackUrl}'>Reset Password</a>");

                    TempData["Message"] = "Please check your email to reset your password.";
                }
                else
                {
                    TempData["ErrorMessage"] = "The email you entered is not registered";
                }
                return RedirectToAction("ForgotPassword");
            }
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> ResetPassword(int userId, string token)
        {
            if (string.IsNullOrEmpty(token) || userId <= 0)
            {
                TempData["ErrorMessage"] = "Invalid reset link.";
                return View(new ResetPasswordModel());
            }

            var resetToken = await _context.PasswordTokens
                .FirstOrDefaultAsync(t => t.UserId == userId && t.Token == token);

            if (resetToken == null)
            {
                TempData["ErrorMessage"] = "Invalid reset link.";
                return View(new ResetPasswordModel());
            }

            if (resetToken.IsUsed && resetToken.ExpiryDate < DateTime.UtcNow)
            {
                TempData["ErrorMessage"] = "The link validity has expired.";
                return View(new ResetPasswordModel());
            }

            var model = new ResetPasswordModel { UserId = userId, Token = token };
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
        {
           
            if (model.Password != model.ConfirmPassword)
            {
                TempData["ErrorMessage"] = "Passwords do not match. please try again";
                return RedirectToAction("ForgotPassword"); 
            }

            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Invalid Password. please try again";
                return RedirectToAction("ForgotPassword"); 
            }

            var resetToken = await _context.PasswordTokens
                .FirstOrDefaultAsync(t => t.UserId == model.UserId && t.Token == model.Token);

            if (resetToken == null)
            {
                TempData["ErrorMessage"] = "Invalid reset link.";
                return RedirectToAction("ForgotPassword");
            }

            if (resetToken.ExpiryDate < DateTime.UtcNow)
            {
                TempData["ErrorMessage"] = "The link validity has expired.";
                return RedirectToAction("ForgotPassword");
            }

            var user = await _context.Users.FindAsync(model.UserId);
            if (user == null)
            {
                TempData["ErrorMessage"] = "User not found.";
                return RedirectToAction("ForgotPassword");
            }

            
            user.Password = _passwordHasher.HashPassword(user, model.Password);
            resetToken.IsUsed = true; 

            _context.Update(user);
            _context.Update(resetToken);
            await _context.SaveChangesAsync();

            TempData["Message"] = "Password changed successfully!";
            return RedirectToAction("ForgotPassword"); 
        }
        

        [HttpGet]
        public IActionResult EditProfile()
        {
            SetCurrentUserLevelInViewBag();

            var userId = HttpContext.Session.GetInt32("UserId");
            if (!userId.HasValue)
            {
                return RedirectToAction("User","Account");
            }

            var user = _context.Users.Find(userId.Value);
            if (user == null)
            {
                return NotFound();
            }

            var model = new EditProfileModel
            {
                Id = user.Id,
                Name = user.Name,
                Phone = user.Phone,
                Handle = user.Handle,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl
            };
            if (TempData["QuizMessage"] != null)
            {
                ViewBag.Message = TempData["QuizMessage"];
                ViewBag.MessageType = TempData["QuizMessageType"];
            }


            if (TempData["SuccessMessage"] != null)
            {
                ViewBag.SuccessMessage = TempData["SuccessMessage"];
            }
            if (TempData["ErrorMessage"] != null)
            {
                ViewBag.ErrorMessage = TempData["ErrorMessage"];
            }
            return View(model);
        }

        [HttpPost]
        public IActionResult EditProfile(EditProfileModel model)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (!userId.HasValue)
            {
                ViewBag.ErrorMessage = "You need to log in to update your profile.";
                SetCurrentUserLevelInViewBag();
                return RedirectToAction("User", "Account"); 
            }

            var user = _context.Users.Find(userId.Value);
            if (user == null)
            {
                ViewBag.ErrorMessage = "User not found.";
                SetCurrentUserLevelInViewBag();
                return View(model);
            }

            model.AvatarUrl = user.AvatarUrl;

            if (ModelState.IsValid)
            {
              
                if (!string.IsNullOrEmpty(model.NewPassword) || !string.IsNullOrEmpty(model.ConfirmPassword))
                {
                    
                    if (string.IsNullOrEmpty(model.OldPassword))
                    {
                        ModelState.AddModelError("OldPassword", "Old password is required to change the password.");
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    var hasher = new PasswordHasher<User>();
                    var result = hasher.VerifyHashedPassword(user, user.Password, model.OldPassword);
                    if (result != PasswordVerificationResult.Success)
                    {
                        ModelState.AddModelError("OldPassword", "The old password is incorrect.");
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    if (string.IsNullOrEmpty(model.NewPassword))
                    {
                        ModelState.AddModelError("NewPassword", "New password is required.");
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    if (model.NewPassword.Length < 8 || !System.Text.RegularExpressions.Regex.IsMatch(model.NewPassword, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"))
                    {
                        ModelState.AddModelError("NewPassword", "New password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character.");
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    if (model.NewPassword != model.ConfirmPassword)
                    {
                        ModelState.AddModelError("ConfirmPassword", "New password and confirm password do not match.");
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    user.Password = hasher.HashPassword(user, model.NewPassword);
                }

                user.Name = model.Name;
                user.Phone = model.Phone;
                user.Handle = model.Handle;
                user.Email = model.Email;

                if (model.Avatar != null && model.Avatar.Length > 0)
                {
                    if (model.Avatar.Length > 2 * 1024 * 1024)
                    {
                        ViewBag.ErrorMessage = "Image size must be less than 2MB.";
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }
                    if (!model.Avatar.ContentType.StartsWith("image/"))
                    {
                        ViewBag.ErrorMessage = "Only image files are allowed.";
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/avatars");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.Avatar.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            model.Avatar.CopyTo(stream);
                        }
                    }
                    catch (Exception ex)
                    {
                        ViewBag.ErrorMessage = "An error occurred while uploading the image.";
                        SetCurrentUserLevelInViewBag();
                        return View(model);
                    }

                    user.AvatarUrl = "/uploads/avatars/" + fileName;
                    model.AvatarUrl = user.AvatarUrl;
                }

                try
                {
                    _context.SaveChanges();
                    ViewBag.SuccessMessage = "Profile updated successfully!";
                    model.OldPassword = null;
                    model.NewPassword = null;
                    model.ConfirmPassword = null;
                }
                catch (Exception ex)
                {
                    ViewBag.ErrorMessage = "An error occurred while saving changes. Please try again.";
                    SetCurrentUserLevelInViewBag();
                    return View(model);
                }
                SetCurrentUserLevelInViewBag();

                return View(model);
            }
            SetCurrentUserLevelInViewBag();
            return View(model);
        }
        [HttpGet]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // بيمسح بيانات المستخدم من السيشن
            return RedirectToAction("Index", "Home"); // يرجعه لصفحة تسجيل الدخول
        }

    }
}