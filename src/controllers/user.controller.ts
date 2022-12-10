
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
  get,
  post,
  requestBody,
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
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @authenticate('jwt')
  @get('/users', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
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

  @post('/users/find-or-create')
  async findOrCreateUser(@requestBody() user: User) {
    const { userAddress } = user;
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
