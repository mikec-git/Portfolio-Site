using Microsoft.EntityFrameworkCore;
using SendMail.Entities;
using System;

namespace SendMail.Data
{
    public static class ModelBuilderExtensions
    {
        /// <summary>
        /// Class that seeds dummy data for the database
        /// </summary>
        /// <param name="modelBuilder"></param>
        public static void Seed(this ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<EmailAddress>().HasData(
                new EmailAddress()
                {
                    Id = 1,
                    Name = Startup.Configuration["EmailConfiguration:ToName"],
                    Email = "MC@gmail.com"
                },
                new EmailAddress()
                {
                    Id = 2,
                    Name = "Jim",
                    Email = "Jimbo@gmail.com"
                },
               new EmailAddress()
               {
                   Id = 3,
                    Name = "Timothy",
                    Email = "Tim105@outlook.com"
               },
                new EmailAddress()
                {
                    Id = 4,
                    Name = "Sara",
                    Email = "Sara96@yahoo.com"
                }
            );

            modelBuilder.Entity<Email>().HasData(
                new Email()
                {
                    Id = 1,
                    Subject = Startup.Configuration["EmailConfiguration:Subject"] + "Jim",
                    MessageText = "Hey this is Jim!",
                    DateSent = DateTime.Now
                },
                new Email()
                {
                    Id = 2,
                    Subject = Startup.Configuration["EmailConfiguration:Subject"] + "Timothy",
                    MessageText = "Hey this is Timothy!",
                    DateSent = DateTime.Now
                },
                new Email()
                {
                    Id = 3,
                    Subject = Startup.Configuration["EmailConfiguration:Subject"] + "Sara",
                    MessageText = "Hey this is Sara!",
                    DateSent = DateTime.Now
                }
            );

            modelBuilder.Entity<DeliveredEmail>().HasData(
                 new
                 {
                     Id = 1,
                     EmailId = 1,
                     SenderId = 2,
                     ReceiverId = 1
                 },
                new
                {
                    Id = 2,
                    EmailId = 2,
                    SenderId = 3 ,
                    ReceiverId = 1
                },
                new
                {
                    Id = 3,
                    EmailId = 3,
                    SenderId = 4 ,
                    ReceiverId = 1
                }
            );
        }
    }
}
