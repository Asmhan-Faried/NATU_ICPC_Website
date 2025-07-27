using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using tired.Models;
using System;
using Microsoft.AspNetCore.Http;
using tired.Models;


namespace tired.Controllers
{
    public class LoginController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        public LoginController(AppDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpPost]
        public IActionResult Login(LoginModel model)
        {
            ViewBag.Mode = "login";
            if (ModelState.IsValid)
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == model.Email.ToLower());
                if (user != null)
                {

                    var result = _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password);

                    if (result == PasswordVerificationResult.Success)
                    {
                        HttpContext.Session.SetInt32("UserId", user.Id);
                        return RedirectToAction("Frist", "Home");
                    }
                }

                ModelState.AddModelError("", "Oops! Email or password doesn’t match.");
            }

            return View("~/Views/Account/User.cshtml", model);
        }
    }
}