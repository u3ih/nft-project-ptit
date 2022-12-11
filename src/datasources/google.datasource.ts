// import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
// import { juggler } from "@loopback/repository";
//
// const defaultHeaders = {
//     "content-type": "application/json",
// };
// const config = {
//     name: "Google",
//     connector: "rest",
//     baseURL: process.env.DOMAIN_GOOGLE || "https://www.google.com",
//     options: defaultHeaders,
//     operations: [
//         {
//             template: {
//                 method: "POST",
//                 url: `${process.env.DOMAIN_GOOGLE}/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY || "6LeW6f8eAAAAAO2JeRglKliNm5iVLVuoWG4nhs5h"}&response={gRecaptchaResponse}`,
//             },
//             functions: {
//                 "verifyRecaptcha": ["gRecaptchaResponse"],
//             },
//         },
//     ],
//     crud: false,
// };
//
// // Observe application's life cycle to disconnect the datasource when
// // application is stopped. This allows the application to be shut down
// // gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// // Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
// @lifeCycleObserver("datasource")
// export class GoogleApiDataSource extends juggler.DataSource
//     implements LifeCycleObserver {
//     static dataSourceName = "Google";
//     static readonly defaultConfig = config;
//
//     constructor(
//         @inject("datasources.config.Google", { optional: true })
//             dsConfig: object = config,
//     ) {
//         super(dsConfig);
//     }
// }
