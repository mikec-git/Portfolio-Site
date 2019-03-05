using Microsoft.EntityFrameworkCore;
using SendMail.Data;
using SendMail.Entities;
using System;
using System.Collections.Generic;

namespace SendMail.Test
{
    public class SendMailTestBase : IDisposable
    {
        protected readonly EmailDbContext _context;

        /// <summary>
        /// Uses InMemoryDatabase to create a mock database for each test
        /// </summary>
        public SendMailTestBase()
        {
            var options = new DbContextOptionsBuilder<EmailDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new EmailDbContext(options);
            _context.Database.EnsureCreated();
        }

        /// <summary>
        /// Called at end of each test - Clears database and disposes of context instance
        /// </summary>
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
        
        /// <summary>
        /// Seeds DB with dummy email addresses
        /// </summary>
        public void SeedEmailAddresses()
        {
            var emailAddresses = new List<EmailAddress>() {
                new EmailAddress()
                {
                    Id = 1,
                    Name = "Michael C",
                    Email = "MC@gmail.com"
                },
                new EmailAddress()
                {
                    Id = 2,
                    Name = "Jim Garner",
                    Email = "Jimbo@gmail.com"
                },
                new EmailAddress()
                {
                    Id = 3,
                    Name = "Timothy Smith",
                    Email = "Tim105@outlook.com"
                },
                new EmailAddress()
                {
                    Id = 4,
                    Name = "Sara B",
                    Email = "Sara96@yahoo.com"
                }
            };
            _context.EmailAddresses.AddRange(emailAddresses);
            _context.SaveChanges();
        }

        public void SeedEmails()
        {
            var emails = new List<Email>() {
                new Email()
                {
                    Id = 1,
                    Subject = "This is a test email from " + "Jim",
                    MessageText = "Hey this is Jim!",
                    DateSent = DateTime.Now
                },
                new Email()
                {
                    Id = 2,
                    Subject = "This is a test email from " + "Timothy",
                    MessageText = "Hey this is Timothy!",
                    DateSent = DateTime.Now
                },
                new Email()
                {
                    Id = 3,
                    Subject = "This is a test email from " + "Sara",
                    MessageText = "Hey this is Sara!",
                    DateSent = DateTime.Now
                }
            };
            _context.Emails.AddRange(emails);
            _context.SaveChanges();
        }
    }
}
