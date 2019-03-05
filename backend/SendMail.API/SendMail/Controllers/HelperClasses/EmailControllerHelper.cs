using SendMail.Models;
using System;

namespace SendMail.Controllers.HelperMethods
{
    public static class EmailControllerHelper
    {
        /// <summary>
        /// Helper method that creates a complete email DTO for sending to the client
        /// </summary>
        /// <param name="senderName"></param>
        /// <param name="senderEmailAddress"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static EmailToSendModel CreateEmailToSendDto(string senderName, string senderEmailAddress, string message, string date, DateTime serverDate)
        {
            return new EmailToSendModel()
            {
                // Receiver info for the email
                Receiver = new EmailAddressModel()
                {
                    Name = Environment.GetEnvironmentVariable("ToName"),
                    Email = Environment.GetEnvironmentVariable("ToEmail")
                },
                // Sender info for the email
                Sender = new EmailAddressModel()
                {
                    Name = senderName ?? "Stranger",
                    Email = senderEmailAddress
                },
                // Body content for the email
                Email = new EmailMessageModel()
                {
                    Subject = Environment.GetEnvironmentVariable("Subject") + senderName,
                    MessageText = $"You've got a message from: \n" +
                    $"{senderName}\n" +
                    $"Reply to: \n" +
                    $"{senderEmailAddress}\n" +
                    $"The email is shown below: \n" +
                    $"{message}",
                    DateSent = date,
                    ServerDate = serverDate
                }
            };
        }
    }
}
