using Microsoft.Extensions.DependencyInjection;
using SendMail.Services;

namespace SendMail.Configuration
{
    public static class ConfigureEmailSenderServices
    {
        /// <summary>
        /// Injects the <see cref="EmailSender" /> into the services to handle the <see cref="IEmailSender"/> service
        /// </summary>
        /// <param name="=services"></param>
        public static void ConfigureEmailSender(this IServiceCollection services)
        {
            // Inject the EmailSender service
            services.AddTransient<IEmailSender, EmailSender>();
        }
    }
}
