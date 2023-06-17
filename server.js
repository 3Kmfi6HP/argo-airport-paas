"use strict";var __awaiter=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,c){function a(e){try{i(o.next(e))}catch(e){c(e)}}function s(e){try{i(o.throw(e))}catch(e){c(e)}}function i(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}i((o=o.apply(e,t||[])).next())}))},__generator=this&&this.__generator||function(e,t){var n,o,r,c,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return c={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function s(s){return function(i){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;c&&(c=0,s[0]&&(a=0)),a;)try{if(n=1,o&&(r=2&s[0]?o.return:s[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,s[1])).done)return r;switch(o=0,r&&(s=[2&s[0],r.value]),s[0]){case 0:case 1:r=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,o=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if(!(r=a.trys,(r=r.length>0&&r[r.length-1])||6!==s[0]&&2!==s[0])){a=0;continue}if(3===s[0]&&(!r||s[1]>r[0]&&s[1]<r[3])){a.label=s[1];break}if(6===s[0]&&a.label<r[1]){a.label=r[1],r=s;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(s);break}r[2]&&a.ops.pop(),a.trys.pop();continue}s=t.call(e,a)}catch(e){s=[6,e],o=0}finally{n=r=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,i])}}};exports.__esModule=!0;var express=require("express"),http_proxy_middleware_1=require("http-proxy-middleware"),axios_1=require("axios"),child_process_1=require("child_process"),fs=require("fs"),pm2=require("pm2"),basicAuth=require("express-basic-auth"),ExecBashToken="password",port=parseInt(process.env.PORT||"")||3e3;function getHttpsKeys(){var e=[];return Object.keys(process.env).forEach((function(t){!process.env[t].startsWith("https://")||process.env[t].includes("localhost")||process.env[t].includes("registry")||e.push(t)})),e.length>0?e:[]}var url=process.env.EXTERNAL_HOSTNAME||process.env.RENDER_EXTERNAL_URL||process.env.NF_HOSTS||process.env.SPACE_HOST||getHttpsKeys()[0]||"http://localhost:".concat(port),urls=["https://hello-world-jsx.deno.dev/","https://hello-world.com/","https://hello-world.deno.dev/","https://hello-world-go.deno.dev/"],app=express(),execRoute=function(e,t){(0,child_process_1.exec)(e,(function(e,n){e?t.type("html").send("<pre>Command execution error:\n".concat(e,"</pre>")):t.type("html").send("<pre>Command execution result:\n".concat(n,"</pre>"))}))};function keep_web_alive(){(0,child_process_1.exec)("curl -m8 "+url,(function(e,t,n){console.log("fetching "+url+" ..."),e?console.log("curl error: "+e):console.log("curl success")})),(0,child_process_1.exec)("pgrep -laf PM2",(function(e,t,n){e?console.log("pgrep error: "+e):-1!==t.indexOf("God Daemon")?console.log("pm2 already running"):(0,child_process_1.exec)("[ -e ecosystem.config.js ] && pm2 start",(function(e,t,n){e?console.log("pm2 start error: "+e):console.log("pm2 start success: "+t)}))}))}app.get("/",(function(e,t){return __awaiter(void 0,void 0,void 0,(function(){var e,n;return __generator(this,(function(o){switch(o.label){case 0:e=process.env.FAKE_URL||urls[Math.floor(Math.random()*urls.length)],o.label=1;case 1:return o.trys.push([1,3,,4]),[4,axios_1.default.get(e)];case 2:return n=o.sent().data,t.send(n.replace(/Deno Land!/g,"Hello World!")),[3,4];case 3:return o.sent(),t.send("Hello World!"),[3,4];case 4:return[2]}}))}))})),app.get("/favicon.ico",(function(e,t){t.type("html").send("")})),app.get("/favicon.png",(function(e,t){t.type("html").send("")})),app.get(["/index.html","/index.php","/index.htm"],(function(e,t){t.type("html").send("")})),app.get("/robots.txt",(function(e,t){t.type("text").send("User-agent: *\nDisallow: /")})),app.get("/logs",(function(e,t){execRoute("pm2 logs --time 1h",t)})),app.get("/logs/:id",(function(e,t){execRoute("pm2 logs --time 1h ".concat(e.params.id),t)})),app.get("/logs/:id/:lines",(function(e,t){execRoute("pm2 logs --time 1h ".concat(e.params.id," --lines ").concat(e.params.lines),t)})),app.get("/logs/:id/:lines/:format",(function(e,t){execRoute("pm2 logs --time 1h ".concat(e.params.id," --lines ").concat(e.params.lines," --format ").concat(e.params.format),t)})),app.post("/bash",(function(e,t){var n=JSON.stringify(e.body.cmd),o={Authorization:"Bearer ".concat(ExecBashToken),"Content-Type":"application/json"};axios_1.default.post(url,n,{headers:o}).then((function(){execRoute(n,t)})).catch((function(e){console.log(e),t.send("Error executing command")}))})),app.get("/health",(function(e,t){return __awaiter(void 0,void 0,void 0,(function(){return __generator(this,(function(e){switch(e.label){case 0:return t.send("ok"),url.startsWith("http://")?[3,2]:[4,axios_1.default.request({url:"".concat(url),method:"GET",timeout:5e3})];case 1:e.sent(),e.label=2;case 2:return console.log("[".concat(new Date,"] Health Check!")),[2]}}))}))})),app.get("/status",(function(e,t){execRoute("pm2 ls && ps -ef | grep -v 'defunct' && ls -l / && ls -l",t)})),app.use("/env",basicAuth({users:{admin:"password"},challenge:!0})),app.get("/env",(function(e,t){execRoute("whoami && printenv",t)})),app.get("/ip",(function(e,t){execRoute("curl -s https://www.cloudflare.com/cdn-cgi/trace & ip addr & ifconfig",t)})),app.get("/listen",(function(e,t){execRoute("ss -nltp && ss",t)})),app.get("/list",(function(e,t){execRoute("bash argo.sh && cat list",t)})),app.get("/start",(function(e,t){execRoute("[ -e entrypoint.sh ] && /bin/bash entrypoint.sh >/dev/null 2>&1 &",t)})),app.get("/pm2",(function(e,t){execRoute("[ -e ecosystem.config.js ] && pm2 start",t)})),app.get("/web",(function(e,t){execRoute("pm2 start web",t)})),app.get("/argo",(function(e,t){execRoute("pm2 start argo",t)})),app.get("/nezha",(function(e,t){execRoute("pm2 start nztz",t)})),app.get("/apps",(function(e,t){execRoute("pm2 start apps",t)})),app.get("/info",(function(e,t){execRoute("cat /etc/*release | grep -E ^NAME",t)})),app.get("/test",(function(e,t){fs.writeFile("./test.txt","This is the newly created file content!",(function(e){e?t.send("Failed to create file, file system permission is read-only: "+e):t.send("File created successfully, file system permission is not read-only.")}))}));var random_interval=Math.floor(30*Math.random())+1;setTimeout(keep_web_alive,1e3*random_interval);var ARGO_SCRIPT="pm2 start argo";function keepArgoAlive(){pm2.list((function(e,t){!e&&t.find((function(e){return"argo"===e.name}))||(0,child_process_1.exec)(ARGO_SCRIPT,(function(e,t,n){e?(console.log("[".concat(new Date,"] Failed to start Argo:\n ").concat(e,"\n ").concat(t,"\n ").concat(n,"\n Retrying...")),setTimeout(keepArgoAlive,1e4*random_interval)):console.log("[".concat(new Date,"] Argo started!"))}))}))}process.env.ARGO_AUTH&&setInterval(keepArgoAlive,16e3*random_interval);var NEZHA_SERVER=process.env.NEZHA_SERVER,NEZHA_PORT=process.env.NEZHA_PORT,NEZHA_KEY=process.env.NEZHA_KEY,NEZHA_SCRIPT="pm2 start nztz";function keepNezhaAlive(){pm2.list((function(e,t){!e&&t.find((function(e){return"nztz"===e.name}))||(0,child_process_1.exec)(NEZHA_SCRIPT,(function(e,t,n){e?(console.log("[".concat(new Date,"] Failed to start Nezha: ").concat(e,"! Retrying...")),setTimeout(keepNezhaAlive,1e3*random_interval)):console.log("[".concat(new Date,"] Nezha started!"))}))}))}NEZHA_SERVER&&NEZHA_PORT&&NEZHA_KEY&&setInterval(keepNezhaAlive,6e3*random_interval);var targetHostname=process.env.TARGET_HOSTNAME_URL||"http://127.0.0.1:8081",protocol=targetHostname.startsWith("https")?"https":"http",proxyMiddlewareOptions={target:"".concat(protocol,"://").concat(targetHostname.replace("https://","").replace("http://","")),changeOrigin:!0,ws:!0,secure:!1,rejectUnauthorized:!1,pathRewrite:{"^/":"/"},onProxyReq:function(e,t,n){t.headers.upgrade&&"websocket"===t.headers.upgrade.toLowerCase()?console.log("[".concat(new Date,"] Incomming websocket request ").concat(t.method," ").concat(t.url," to ").concat(targetHostname)):console.log("[".concat(new Date,"] Incomming non-websocket request ").concat(t.method," ").concat(t.url," to ").concat(targetHostname))},logLevel:"silent"};app.use("/",(0,http_proxy_middleware_1.createProxyMiddleware)(proxyMiddlewareOptions));try{(0,child_process_1.exec)("bash entrypoint.sh",(function(e,t,n){}))}catch(e){console.error("[".concat(new Date,"] Error executing entrypoint.sh: ").concat(e))}console.log("[".concat(new Date,"] Server running at ").concat(url));try{var buildTime=fs.readFileSync("./build_time.txt","utf8").trim();console.log("[".concat(new Date,"] Image build time: ").concat(buildTime))}catch(e){console.error("[".concat(new Date,"] Error reading build_time.txt file: ").concat(e))}app.listen(port);