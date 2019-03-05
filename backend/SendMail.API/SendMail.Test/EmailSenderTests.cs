using MimeKit;
using SendMail.Models;
using SendMail.Services;
using System;
using Xunit;

namespace SendMail.Test
{
    public class EmailSenderTests
    {
        [Fact(DisplayName = "ConstructEmailToSend")]
        public void ConstructEmailToSend_ShouldReturnConstructedEmail()
        {
            var emailSender = new EmailSender();

            // Act
            var emailToTest = new EmailToSendModel()
            {
                Sender = new EmailAddressModel()
                {
                    Name = "Jimbo",
                    Email = "Jimbo@jimmy.com"
                },
                Receiver = new EmailAddressModel()
                {
                    Name = "Mike",
                    Email = "mc@gmail.com"
                },
                Email = new EmailMessageModel()
                {
                    Subject = "Test email Subject",
                    MessageText = "Some text",
                    MessageHtml = "Some Html",
                    DateSent = "Today's Date"
                }
            };

            var actualEmailToSend = emailSender.ConstructEmailToSend(emailToTest);

            // Assert
            Assert.True(actualEmailToSend != null);
            Assert.Equal(new MailboxAddress(emailToTest.Sender.Name, emailToTest.Sender.Email), actualEmailToSend.From[0]);
            Assert.Equal(new MailboxAddress(emailToTest.Receiver.Name, emailToTest.Receiver.Email), actualEmailToSend.To[0]);
            Assert.Equal(emailToTest.Email.Subject, actualEmailToSend.Subject);
        }
    }
}
