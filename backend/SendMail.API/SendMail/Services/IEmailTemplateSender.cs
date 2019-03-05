using SendMail.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SendMail.Services
{
    public interface IEmailTemplateSender
    {
        /// <summary>
        /// Sends an email with a general template
        /// </summary>
        /// <param name="email"></param>
        /// <param name="sender"></param>
        /// <param name="timeStamp"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        Task<EmailSentResponse> SendGeneralEmailAsync(
            EmailToSendModel email, 
            string title, 
            string subtitle, 
            string body);
    }
}
