using Newtonsoft.Json;
using SendMail.Models;
using SendMail.Services.HelperClasses;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SendMail.Services
{
    /// <summary>
    /// Sends the email body, formatted with a specific HTML template
    /// </summary>
    public class EmailTemplateSender : IEmailTemplateSender
    {
        private readonly IEmailSender _emailSender;

        public EmailTemplateSender(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task<EmailSentResponse> SendGeneralEmailAsync(EmailToSendModel email, string title, string subtitle, string body)
        {
            // Parses the html template to text
            var templateText = await ReturnTemplateFromFileAsync("SendMail.Templates.GeneralWebsiteTemplate.html");
            
            // Deep clone template and email
            var toReceiverTemplate = string.Copy(templateText);
            var toReceiverEmail = EmailSenderHelper.DeepCopy(email);

            // Formatted server time to more readable form
            var formattedDate = toReceiverEmail.Email.ServerDate.ToString("dddd, dd MMM yyyy, HH:mm:ss UTC");
            toReceiverEmail.Email.DateSent = formattedDate;

            // Replace variables in template with email text and set to message Html body
            toReceiverEmail.Email.MessageHtml = ReplaceVariablesInTemplate(toReceiverTemplate, title, subtitle, formattedDate, body);

            // Set to true to send Html content
            toReceiverEmail.IsHtml = true;

            // Send email to Receiver
            var response = await _emailSender.SendEmailAsync(toReceiverEmail);

            // If email was sent successfully...
            if (response.Successful)
            {
                // Make another clone of the original email
                var toSenderEmail = EmailSenderHelper.DeepCopy(email);
                
                // Send confirmation email to sender
                await SendGeneralConfirmationEmailAsync(toSenderEmail);
            }

            // Return response from email to receiver
            return response;
        }

        /// <summary>
        /// Confirmation email sent to the sender...
        /// </summary>
        /// <param name="toSenderEmail"></param>
        /// <returns></returns>
        public async Task SendGeneralConfirmationEmailAsync(EmailToSendModel toSenderEmail)
        {
            // Sender template (No body)
            var templateText = await ReturnTemplateFromFileAsync("SendMail.Templates.GeneralWebsiteTemplateToSender.html");

            // Confirmation text for sender
            var title = $"Hey {toSenderEmail.Sender.Name},<br/>Thanks for getting in touch!";
            var subtitle = "I'll try to reply as soon as I can.";

            // New subject title for confirmation email
            toSenderEmail.Email.Subject = "Thanks for getting in touch, " + toSenderEmail.Sender.Name + "!";

            // Replace variables in template with response text and set to Html body
            toSenderEmail.Email.MessageHtml = ReplaceVariablesInTemplate(templateText, title, subtitle, toSenderEmail.Email.DateSent, string.Empty);

            // Set text message in body with confirmation text
            toSenderEmail.Email.MessageText = $"Hey {toSenderEmail.Sender.Name},\n" 
                + $"Thanks for getting in touch!\n" 
                + subtitle;

            // Set to true to send Html content
            toSenderEmail.IsHtml = true;

            // Swap the sender and receiver with deep clone
            var tempSender = EmailSenderHelper.DeepCopy(toSenderEmail.Sender);
            toSenderEmail.Sender = toSenderEmail.Receiver;
            toSenderEmail.Receiver = tempSender;

            // Send confirmation email to Sender
            var response = await _emailSender.SendEmailAsync(toSenderEmail);
        }

        // Replaces variables in template with given strings
        private string ReplaceVariablesInTemplate(string template, string title, string subtitle, string date, string body)
        {
            return template
                .Replace("--TITLE--", title)
                .Replace("--SUBTITLE--", subtitle)
                .Replace("--DATE--", date)
                .Replace("--BODY--", body);
        }

        // Reads the html template to text
        private async Task<string> ReturnTemplateFromFileAsync(string filePath)
        {
            // Read template from file
            var stream = Assembly.GetEntryAssembly().GetManifestResourceStream(filePath);
            using (var reader = new StreamReader(stream, Encoding.UTF8))
            {
                return await reader.ReadToEndAsync();
            }
        }        
    }
}
