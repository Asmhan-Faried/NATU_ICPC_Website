using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using tired.Models;
namespace tired.Controllers
{
    public class ContactController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;


        public ContactController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        private void SetCurrentUserLevelInViewBag()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId.HasValue)
            {
                var user = _context.Users.Find(userId.Value);
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
        [HttpGet]
        public IActionResult Index()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(string email, string message)
        {
            try
            {
                email = email?.ToLower();

                // Validate email and message
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(message))
                {
                    ViewBag.ErrorMessage = "يرجى إدخال البريد الإلكتروني والرسالة.";
                    return View();
                }
                // Get SMTP settings from appsettings.json
                var smtpServer = _configuration["Smtp:SmtpServer"];
                var smtpPort = int.Parse(_configuration["Smtp:SmtpPort"]);
                var username = _configuration["Smtp:Username"];
                var password = _configuration["Smtp:Password"];
                var toEmail = _configuration["Smtp:ToEmail"];

                // Configure the SMTP client
                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new System.Net.NetworkCredential(username, password);

                    // Create the email message with HTML body
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(username),
                        Subject = "New Contact Form Submission",
                        Body = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                               "<h3 style='color: #333;'>Hello,</h3>" +
                               "<p style='color: #666;'>A new form has been submitted on your website. Details below.</p>" +
                               "<div style='margin: 20px 0;'>" +
                               "<p><strong style='color: #000;'>Email</strong><br>" +
                               $"<span style='color: #444;'>{email}</span></p>" +
                               "<p><strong style='color: #000;'>Message</strong><br>" +
                               $"<span style='color: #444;'>{message}</span></p>" +
                               "</div>" +
                               "</div>",
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(toEmail);

                    // Send the email
                    client.Send(mailMessage);

                    TempData["SuccessMessage"] = "Your message has been sent successfully! 📧";
                    return RedirectToAction("Frist", "Home");
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Failed to send message. Please try again later. 😔 Error: " + ex.Message;
                return RedirectToAction("Index");
            }
        }
    }
}