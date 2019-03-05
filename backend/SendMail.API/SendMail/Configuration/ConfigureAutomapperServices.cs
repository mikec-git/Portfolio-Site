using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using SendMail.Entities;
using SendMail.Models;

namespace SendMail
{
    public static class ConfigureAutoMapperServices
    {
        /// <summary>
        /// Initialize mappings for AutoMapper and prep for chaining
        /// </summary>
        /// <param name="services"></param>
        public static void ConfigureAutoMapper(this IServiceCollection services)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<EmailAddressModel, EmailAddress>();
                cfg.CreateMap<EmailMessageModel, DeliveredEmail>()
                    .ForPath(
                        dest => dest.Email.Subject,
                        opt => opt.MapFrom(src => src.Subject))
                    .ForPath(
                        dest => dest.Email.MessageText, 
                        opt => opt.MapFrom(src => src.MessageText))
                    .ForPath(
                        dest => dest.Email.MessageHtml,
                        opt => opt.MapFrom(src => src.MessageHtml))
                    .ForPath(
                        dest => dest.Email.DateSent, 
                        opt => opt.MapFrom(src => src.ServerDate));
            });

            var mapper = config.CreateMapper();
            services.AddSingleton(mapper);
        }
    }
}
