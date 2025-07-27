using Microsoft.AspNetCore.Mvc;
using System;
using tired.Models;
using System.Linq;

public class FinalQuizController : Controller
{
    public ActionResult LevelUpQuiz()
    {
        return View();
    }
    private readonly AppDbContext _context;
    public FinalQuizController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult SubmitLevelUpQuiz(
        string q1, string q2, string q3, string q4, string q5,
        string q6, string q7, string q8, string q9, string q10,
        string q11, string q12, string q13, string q14, string q15,
        string q16, string q17, string q18, string q19, string q20)
    {
        int score = 0;
        int totalQuestions = 20;

        if (q1 == "2.5") score++;
        if (q2 == "undefined Behavior") score++;
        if (q3 == "1") score++;
        if (q4 == "10 11") score++;
        if (q5 == "A very large positive number") score++;

        if (q6 == "False then 1") score++;
        if (q7 == "Yes") score++;
        if (q8 == "A") score++;
        if (q9 == "Assigned then 5") score++;
        if (q10 == "At least one true") score++;

        if (q11 == "0 2") score++;
        if (q12 == "6") score++;
        if (q13 == "0 1 2") score++;
        if (q14 == "6") score++;
        if (q15 == "0") score++;

        if (q16 == "40") score++;
        if (q17 == "5") score++;
        if (q18 == "3") score++;
        if (q19 == "9") score++;
        if (q20 == "undefined Behavior") score++;

        double percentage = (double)score / totalQuestions * 100;


        User currentUser = GetCurrentUser();

        string message = "";
        string messageType = "";

        if (currentUser != null)
        {
            if (percentage >= 60)
            {
                currentUser.Level = 2;
                UpdateUserInDatabase(currentUser);
                message = $"Congratulations! You scored {percentage:F0}% and your level has been upgraded to Level 2.";
                messageType = "success";
            }
            else
            {
                currentUser.Level = 1;
                UpdateUserInDatabase(currentUser);
                message = $"Unfortunately, you scored {percentage:F0}%. You need 60% or more to upgrade. Please review the materials and try again.";
                messageType = "error";
            }
        }
        else
        {
            message = "An error occurred: User not found.";
            messageType = "error";
        }

        TempData["QuizMessage"] = message;
        TempData["QuizMessageType"] = messageType;

        return RedirectToAction("EditProfile", "Account");
    }


    private User GetCurrentUser()
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId.HasValue)
        {
            return _context.Users.FirstOrDefault(u => u.Id == userId.Value);
        }
        return null;

    }

    private void UpdateUserInDatabase(User user)
    {
        if (user != null)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }
    }
}