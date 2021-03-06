﻿using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof(Livefeed.Api.Startup))]
namespace Livefeed.Api
{
  public class Startup
  {
    public void Configuration(IAppBuilder app)
    {
      // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
      ConfigureSignalR(app);
    }


    private void ConfigureSignalR(IAppBuilder app)
    {
      // Branch the pipeline here for requests that start with "/signalr"
      app.Map("/signalr", map =>
      {
        // Setup the CORS middleware to run before SignalR.
        // By default this will allow all origins. You can 
        // configure the set of origins and/or http verbs by
        // providing a cors options with a different policy.
        map.UseCors(CorsOptions.AllowAll);
        var hubConfiguration = new HubConfiguration
        {
          EnableDetailedErrors = true,
          EnableJavaScriptProxies = false,
          // You can enable JSONP by uncommenting line below.
          // JSONP requests are insecure but some older browsers (and some
          // versions of IE) require JSONP to work cross domain
          //EnableJSONP = true
        };

        // Require authentication for all hubs
        //var queryStringAuthorizer = new QueryStringBearerAuthorizeAttribute();
        //var authorizeModule = new AuthorizeModule(queryStringAuthorizer, queryStringAuthorizer);
        //GlobalHost.HubPipeline.AddModule(authorizeModule);

        // Run the SignalR pipeline. We're not using MapSignalR
        // since this branch already runs under the "/signalr"
        // path.
        map.RunSignalR(hubConfiguration);
      });
    }
  }
}
