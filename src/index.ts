import { MyAppApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { MyAppApplication };

let app: any = null;

export const getApplication = () => {
  return app;
};

export async function main(options: ApplicationConfig = {}) {
  app = new MyAppApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
