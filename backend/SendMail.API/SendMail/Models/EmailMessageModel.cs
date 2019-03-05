using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SendMail.Models
{
    public class EmailMessageModel
    {
        /// <summary>
        /// The email subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// The main body of the email - Html
        /// </summary>
        public string MessageHtml { get; set; }

        /// <summary>
        /// The main body of the email - Text
        /// </summary>
        public string MessageText { get; set; }

        /// <summary>
        /// Date that the email was sent (client time)
        /// </summary>
        public string DateSent { get; set; }

        /// <summary>
        /// The server date on which email was sent (server time)
        /// </summary>
        public DateTime ServerDate { get; set; }
    }
}
