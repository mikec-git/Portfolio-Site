using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SendMail.Configuration;
using SendMail.Data;
using SendMail.ExtensionMethods;
using System;

namespace SendMail
{
    public class Startup
    {
        public static IConfiguration Configuration { get; set; }

        public Startup(IHostingEnvironment env, IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // Configuration for Email Sending Services
            services.ConfigureEmailSender();
            services.ConfigureEmailTemplateSender();

            // Configuration for Email Repository
            services.ConfigureEmailRepo();

            // Configuration for AutoMapper
            services.ConfigureAutoMapper();

            var hostname = Environment.GetEnvironmentVariable("SQLSERVER_HOST") ?? "localhost";
            var password = Environment.GetEnvironmentVariable("SQLSERVER_PASSWORD") ?? "secret";
            var connection = $@"Server={hostname};Database=master;User=sa;Password={password};";
            services.AddDbContext<EmailDbContext>(options => options.UseSqlServer(connection));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, EmailDbContext _context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            } else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();

            if (!_context.Database.EnsureCreated())
            {
                _context.Database.Migrate();
            }
        }
    }
}
