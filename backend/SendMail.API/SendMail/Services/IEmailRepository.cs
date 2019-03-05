using SendMail.Entities;
using SendMail.Models;
using System.Collections.Generic;

namespace SendMail.Services
{
    public interface IEmailRepository
    {
        bool EmailAddressExists(string emailAddress);

        EmailAddress GetEmailAddress(EmailAddressModel emailAddress);

        void AddDeliveredEmail(DeliveredEmail sentEmail);

        bool Save();
    }
}
