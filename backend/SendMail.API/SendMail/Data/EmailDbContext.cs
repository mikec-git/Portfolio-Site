using Microsoft.EntityFrameworkCore;
using SendMail.Entities;

namespace SendMail.Data
{
    /// <summary>
    /// The database context for the email sender API
    /// </summary>
    public class EmailDbContext : DbContext
    {
        // Contains the delievered email sender, receiver, and email body
        public virtual DbSet<DeliveredEmail> DeliveredEmails { get; set; }

        // Contains the email addresses of all senders/receivers
        public virtual DbSet<EmailAddress> EmailAddresses { get; set; }

        // Contains the email body (subject, text/html, date)
        public virtual DbSet<Email> Emails { get; set; }

        public EmailDbContext(DbContextOptions<EmailDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
