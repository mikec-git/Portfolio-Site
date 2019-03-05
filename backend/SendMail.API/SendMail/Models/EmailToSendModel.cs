using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SendMail.Models
{
    public class EmailToSendModel
    {
        /// <summary>
        /// The receiver of the email (name, email)
        /// </summary>
        public EmailAddressModel Receiver { get; set; }

        /// <summary>
        /// The sender of the email (name, email)
        /// </summary>
        public EmailAddressModel Sender { get; set; }

        /// <summary>
        /// The email content
        /// </summary>
        public EmailMessageModel Email { get; set; }

        /// <summary>
        /// Boolean for if email is HTML format
        /// </summary>
        public bool IsHtml { get; set; }
    }
}
