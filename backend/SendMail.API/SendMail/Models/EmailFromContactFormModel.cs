using System;
using System.ComponentModel.DataAnnotations;

namespace SendMail.Models
{
    public class EmailFromContactFormModel
    {
        // Validation for the name field of the form from the client-side
        [RegularExpression(@"^(\s*[a-zA-Z]+\s*)+$", ErrorMessage = "Your name should only consist of letters")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "Your name should be between 1 and 50 characters long.")]
        [Required(ErrorMessage = "You're missing your name.")]
        public string Name { get; set; }

        // Validation for the email field of the form from the client-side
        [RegularExpression(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", ErrorMessage = "Please provide a valid email")]
        [Required(ErrorMessage = "You're missing your email.")]
        public string Email { get; set; }

        // Validation for the message field of the form from the client-side
        [RegularExpression(@"^(\s*\S+\s*)+$")]
        [MinLength(1, ErrorMessage = "The message must be longer than 1 character.")]
        [Required(ErrorMessage = "You forgot your message!")]
        public string Message { get; set; }

        // Client date
        public string Date { get; set; }

        // Server date
        public DateTime ServerDate { get; } = DateTime.Now;
    }
}
