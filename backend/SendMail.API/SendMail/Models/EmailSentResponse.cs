using System.Collections.Generic;

namespace SendMail.Models
{
    public class EmailSentResponse
    {
        /// <summary>
        /// True if email sent successfully
        /// </summary>
        public bool Successful => !(ErrorMessage?.Count > 0);

        /// <summary>
        /// Error message if sending email failed
        /// </summary>
        public List<string> ErrorMessage { get; set; }

        /// <summary>
        /// Sent email content
        /// </summary>
        public EmailToSendModel Email { get; set; }
    }
}
