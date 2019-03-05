using SendMail.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SendMail.Entities
{
    /// <summary>
    /// Contains the entire email body for sent emails
    /// </summary>
    public class Email
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

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
        /// Date that the email was sent
        /// </summary>
        public DateTime DateSent { get; set; }
    }
}
