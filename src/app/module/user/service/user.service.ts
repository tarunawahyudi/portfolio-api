import { CreateUserRequest, ShowUserResponse, UserSignupResponse } from '@module/user/dto/user.dto'
import { ProfileResponse, UpdateProfileRequest } from '@module/user/dto/profile.dto'

export interface UserService {
  create(data: CreateUserRequest, clientIp: string | undefined): Promise<UserSignupResponse>
  showByUsername(username: string): Promise<ShowUserResponse>
  showUserProfileByUserId(userId: string): Promise<ProfileResponse>
  updateProfile(userId: string, request: UpdateProfileRequest): Promise<ProfileResponse>
  uploadAvatar(userId: string, avatarFile: File): Promise<{ avatarUrl: string }>
  changePassword(userId: string, oldPass: string, newPass: string): Promise<void>
}
