using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SendMail.Entities
{
    /// <summary>
    /// Contains the data for delivered email relationships between sender, receiver, and email content
    /// </summary>
    public class DeliveredEmail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Contains the email receiver info for this specific email
        public EmailAddress Receiver { get; set; }

        // Contains the email sender info for this specific email
        public EmailAddress Sender { get; set; }

        // Contains the email body info for this specific email
        public Email Email { get; set; }
    }
}
