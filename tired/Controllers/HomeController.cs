using tired.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // تأكدي من وجود هذا الـ using

namespace tired.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext _context;
        private readonly ILogger<HomeController> _logger; // أضفنا الـ logger هنا

        // Constructor المدمج
        public HomeController(AppDbContext context, ILogger<HomeController> logger)
        {
            _context = context;
            _logger = logger; // تهيئة الـ logger
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

        public IActionResult Frist()
        {
            SetCurrentUserLevelInViewBag(); 
            return View();
        }

        public IActionResult Index()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }

        public IActionResult ContactUs()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }

        public IActionResult TrainingPlan()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }

        public IActionResult TrainingPlan2()
        {
            SetCurrentUserLevelInViewBag();

            // الآن نعتمد فقط على ViewBag.CurrentUserLevel الذي تم جلبه من قاعدة البيانات
            if (ViewBag.CurrentUserLevel < 2) // إذا كان المستوى أقل من 2
            {
                TempData["ErrorMessage"] = "Access restricted to Level 2 users. Please upgrade your level in Edit Profile.";
                return RedirectToAction("TrainingPlan", "Home");
            }
            else
            {
                return View();
            }
        }

        public IActionResult Contests()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }

        public IActionResult Contests2()
        {
            SetCurrentUserLevelInViewBag();
            if (ViewBag.CurrentUserLevel < 2)
            {
                TempData["ErrorMessage"] = "Access restricted to Level 2 users. Please upgrade your level in settings.";
                return RedirectToAction("Contests", "Home");
            }
            else
            {
                return View();
            }
        }

        public IActionResult Mentors()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }
        public IActionResult page()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
