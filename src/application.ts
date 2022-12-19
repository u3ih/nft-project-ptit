// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { AuthenticationComponent } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import { MongoDbDataSource } from './datasources';
import { MySequence } from './sequence';
import {AuthenticationUserService} from "./services";
import {STORAGE_DIRECTORY} from "./keys";
export { ApplicationConfig };
var path = require('path');
const UPLOAD_URL_PATH = "/upload";
const getPathUpload = (): string => {
  return "public/upload";
};

export class MyAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    this.static(UPLOAD_URL_PATH, getPathUpload());
    this.configureFileUpload();
    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      // socketioControllers: {
      //   dirs: ["ws-controllers"],
      //   extensions: [".controller.js", ".controller.ts"],
      //   nested: true,
      // },
      datasources: {
        dirs: ["datasources"],
        extensions: [".datasource.js", ".datasource.ts"],
        nested: true,
      },
    };

    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MongoDbDataSource, UserServiceBindings.DATASOURCE_NAME);
    // ------------- END OF SNIPPET -------------
    // @ts-ignore
    this.bind(UserServiceBindings.USER_SERVICE).toClass(AuthenticationUserService);
    //new
    // this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }
  protected configureFileUpload() {
    const destination: string = "public/upload";
    this.bind(STORAGE_DIRECTORY).to(destination);
  }
}
