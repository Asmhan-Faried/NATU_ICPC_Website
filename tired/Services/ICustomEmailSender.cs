using System.Net.Mail;
using System.Threading.Tasks;

namespace tired.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }

    public class ICustomEmailSender : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            using var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new System.Net.NetworkCredential("yassmienabdelazez@gmail.com", "nlksipperdupcbxf"),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("yassmienabdelazez@gmail.com"),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}