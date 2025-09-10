import { CreateUserRequest, ShowUserResponse, UserSignupResponse } from '@module/user/dto/user.dto'
import { ProfileResponse, UpdateProfileRequest } from '@module/user/dto/profile.dto'

export interface UserService {
  create(data: CreateUserRequest): Promise<UserSignupResponse>
  showByUsername(username: string): Promise<ShowUserResponse>
  showUserProfileByUserId(userId: string): Promise<ProfileResponse>
  updateProfile(userId: string, request: UpdateProfileRequest): Promise<void>
}
