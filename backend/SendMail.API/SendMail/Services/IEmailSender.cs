using MimeKit;
using SendMail.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SendMail.Services
{   
    /// <summary>
    /// A service that handles sending emails on behalf of the caller
    /// </summary>
    public interface IEmailSender
    {
        /// <summary>
        /// Sends an email with the given info
        /// </summary>
        /// <param name="email">Details about the email to send</param>
        /// <returns></returns>
        Task<EmailSentResponse> SendEmailAsync(EmailToSendModel email);
    }
}
