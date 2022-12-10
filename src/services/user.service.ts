import { UserService } from "@loopback/authentication";
import { securityId, UserProfile } from "@loopback/security";
import {User} from "../models";

export type Credentials = {
  userId?: string;
  userAddress?: string;
};

export class AuthenticationUserService implements UserService<User, Credentials> {
  constructor(
  ) {

  }
  verifyCredentials(credentials: Credentials): Promise<User> {
    throw new Error("Method not implemented.");
  }

  convertToUserProfile(user: User, permissions?: string[]): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    const userProfile = {
      [securityId]: user.id,
      email: user.email,
      id: user.id,
      address: user?.address,
      userAddress: user?.userAddress,
      fullName: user?.fullName,
      avatar: user?.avatar,
      dateOfBirth: user?.dateOfBirth,
    };
    return userProfile;
  }
}

