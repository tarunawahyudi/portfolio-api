import { AppearanceSettings } from '@module/user/dto/appearance.dto'

export interface ProfileResponse {
  userId: string;
  username: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  displayName: string;
  bio: string;
  address: string;
  avatarUrl: string;
  socials: Record<string, string>;
  website: string;
  jobTitle: string;
  hobbies: string[];
  appearance: AppearanceSettings | null;
}

export interface CreateProfileDto {
  userId: string;
  fullName: string;
  displayName: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  displayName?: string;
  phoneNumber?: string;
  bio?: string;
  address?: string;
  website?: string;
  socials?: Record<string, string>;
  hobbies?: string[];
  appearance?: Partial<AppearanceSettings>;
}
