using SendMail.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SendMail.Entities
{
    /// <summary>
    /// Contains the identity info for each email address
    /// </summary>
    public class EmailAddress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }

        // Links to the sent emails within delivered emails
        [InverseProperty("Sender")]
        public List<DeliveredEmail> EmailsSent { get; set; }

        // Links to the received emails within delivered emails
        [InverseProperty("Receiver")]
        public List<DeliveredEmail> EmailsReceived { get; set; }
    }
}
