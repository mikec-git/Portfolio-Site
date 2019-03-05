using Microsoft.Extensions.DependencyInjection;
using SendMail.Services;

namespace SendMail.ExtensionMethods
{
    /// <summary>
    /// Injects the <see cref="EmailTemplateSender" /> into the services to handle the <see cref="IEmailTemplateSender"/> service
    /// </summary>
    /// <param name="=services"></param>
    public static class ConfigureEmailTemplateSenderServices
    {
        public static void ConfigureEmailTemplateSender(this IServiceCollection services)
        {
            // Inject the EmailSender service
            services.AddTransient<IEmailTemplateSender, EmailTemplateSender>();
        }
    }
}
