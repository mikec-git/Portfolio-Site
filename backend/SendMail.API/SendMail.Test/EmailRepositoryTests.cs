using SendMail.Entities;
using SendMail.Models;
using SendMail.Services;
using SendMail.Test;
using System;
using System.Linq;
using Xunit;

namespace SendMail.Tests
{
    public class EmailRepositoryTests : SendMailTestBase
    {
        /// <summary>
        /// Test for checking if an email address exists in the database
        /// </summary>
        /// <param name="emailAddress"></param>
        /// <param name="expected"></param>
        [Theory(DisplayName = "EmailAddressExists")]
        [InlineData("MC@gmail.com", true)]
        [InlineData("Jimbo@gmail.com", true)]
        [InlineData("SomeRandomEmail@yahoo.com", false)]
        public void EmailAddressExists_ShouldCheckIfEmailExistsInDb(string emailAddress, bool expected)
        {
            SeedEmailAddresses();
            var repository = new EmailRepository(_context);

            // Act
            var emailAddressExists = repository.EmailAddressExists(emailAddress);

            Assert.Equal(expected, emailAddressExists);
        }

        /// <summary>
        /// Test to return a selected email address from the database
        /// </summary>
        [Fact(DisplayName = "GetEmailAddress")]
        public void GetEmailAddress_ShouldReturnEmailAddressFromDb()
        {
            SeedEmailAddresses();
            var repository = new EmailRepository(_context);

            // Test case
            var testEmailAddress = new EmailAddressModel()
            {
                Name = "Mike C",
                Email = "MC@gmail.com"
            };

            var actualEmailAddress = repository.GetEmailAddress(testEmailAddress);

            // Assert
            Assert.True(actualEmailAddress != null);
            Assert.True(testEmailAddress.Name != testEmailAddress.Email);
            Assert.True(actualEmailAddress.Name != actualEmailAddress.Email);
            Assert.Equal(testEmailAddress.Email, actualEmailAddress.Email);
            Assert.Equal(testEmailAddress.Name, actualEmailAddress.Name);
        }

        /// <summary>
        /// Tests the adding of a new delivered email into the database
        /// </summary>
        [Fact(DisplayName = "AddDeliveredEmail")]
        public void AddDeliveredEmail_ShouldAddDeliveredEmailEntityToDb()
        {
            //SeedEmailAddresses();
            var repository = new EmailRepository(_context);

            var testDeliveredEmail = new DeliveredEmail()
            {
                Email = new Email()
                {
                    Subject = "This is a test email sent from XUnit",
                    MessageText = "Hey, reply when you have the chance.",
                    DateSent = DateTime.Now,
                    MessageHtml = "Some HTML"
                },
                Receiver = new EmailAddress()
                {
                    Name = "Me",
                    Email = "me@gmail.com"
                },
                Sender = new EmailAddress()
                {
                    Name = "Michelle",
                    Email = "michelle@yahoo.com"
                }
            };

            repository.AddDeliveredEmail(testDeliveredEmail);
            _context.SaveChanges();

            Assert.Equal(1, _context.DeliveredEmails.Count());
            Assert.Equal(2, _context.EmailAddresses.Count());
            Assert.Equal(1, _context.Emails.Count());
        }
    }
}
