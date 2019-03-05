using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SendMail.Models
{
    public class EmailAddressModel
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        /// <summary>
        /// The name of the email sender/receiver
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The email address of the email sender/receiever
        /// </summary>
        public string Email { get; set; }
    }
}
