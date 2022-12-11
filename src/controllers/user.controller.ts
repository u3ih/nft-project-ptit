
import { authenticate, TokenService } from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  get, HttpErrors, param,
  post, put,
  requestBody, RestBindings,
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import {AuthenticationUserService} from "../services/user.service";
import {User} from "../models";

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @service(AuthenticationUserService)
    public userService: AuthenticationUserService,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @authenticate('jwt')
  @get('/users/me', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    return await this.userRepository.findById(currentUserProfile?.id);
  }

  @authenticate('jwt')
  @get('/users', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  async getAll(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<any[]> {
    return await this.userRepository.find();
  }

  @authenticate('jwt')
  @put('/users/update-info', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  async updateUser(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
      @requestBody() user: User
  ): Promise<any> {
      // @ts-ignore
      delete user.userAddress;
    return await this.userRepository.updateById(currentUserProfile?.id, user);
  }

  @post('/users/find-or-create')
  async findOrCreateUser(
      @requestBody({
          content: {
            "application/json": {
              },
            },
      }) user: any
  ) {
    const { userAddress } = user || {};
    if(!userAddress) {
      throw new HttpErrors.NotFound("Not found user");
    }
    let profileUser = await this.userRepository.findOne({ where: { userAddress } });
    if (!profileUser) {
      profileUser = await this.userRepository.create({ userAddress });
    }
    const profile = this.userService.convertToUserProfile(profileUser as any);
    return {
      ...profileUser,
      'access_token': await this.jwtService.generateToken(profile)
    };
  }
}
