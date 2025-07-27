using Microsoft.AspNetCore.Mvc;
using tired.Models;

namespace tired.Controllers
{
    public class QuizesController : Controller
    {
        private readonly AppDbContext _context;
        public QuizesController(AppDbContext context)
        {
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

        public IActionResult Quizs()
        {
            SetCurrentUserLevelInViewBag();
            return View();
        }
        public IActionResult Quizzesl2()
        {
            SetCurrentUserLevelInViewBag();
            if (ViewBag.CurrentUserLevel != 2)
            {
                TempData["ErrorMessage"] = "Access restricted to Level 2 users.";
                return RedirectToAction("Quizs", "Quizes");
            }
            else
            {
                return View();
            }
        }


        public IActionResult Quize1()
        {
            return View();
        }
        public IActionResult Quize2()
        {
            return View();
        }
        public IActionResult Quize3()
        {
            return View();
        }
        public IActionResult Quize4()
        {
            return View();
        }
        public IActionResult Quize5()
        {
            return View();
        }
        public IActionResult Quize6()
        {
            return View();
        }
        public IActionResult Quize7()
        {
            return View();
        }
        public IActionResult Quize8()
        {
            return View();
        }
        public IActionResult Quize9()
        {
            return View();
        }
        public IActionResult Quize10()
        {
            return View();
        }
        public IActionResult Quize11()
        {
            return View();
        }
        public IActionResult Quize12()
        {
            return View();
        }
        public IActionResult Quizel2_1()
        {
            return View();
        }
        public IActionResult Quizel2_2()
        {
            return View();
        }
        public IActionResult Quizel2_3()
        {
            return View();
        }
        public IActionResult Quizel2_4()
        {
            return View();
        }
        public IActionResult Quizel2_5()
        {
            return View();
        }
        public IActionResult Quizel2_6()
        {
            return View();
        }
        public IActionResult Quizel2_7()
        {
            return View();
        }
        public IActionResult Quizel2_8()
        {
            return View();
        }
        public IActionResult Quizel2_9()
        {
            return View();
        }
        public IActionResult Quizel2_10()
        {
            return View();
        }
        public IActionResult Quizel2_11()
        {
            return View();
        }
        public IActionResult Quizel2_12()
        {
            return View();
        }
    }
}
