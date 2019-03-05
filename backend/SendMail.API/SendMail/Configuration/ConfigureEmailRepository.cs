using Microsoft.Extensions.DependencyInjection;
using SendMail.Services;

namespace SendMail.Configuration
{
    /// <summary>
    /// Injects the <see cref="EmailRepository"/> into the services to handle the <see cref="IEmailRepository"/> service
    /// </summary>
    public static class ConfigureEmailRepository
    {
        public static void ConfigureEmailRepo(this IServiceCollection services)
        {
            services.AddScoped<IEmailRepository, EmailRepository>();
        }
    }
}
