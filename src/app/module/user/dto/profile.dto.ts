export interface ProfileResponse {
  userId: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  displayName: string;
  bio: string;
  address: string;
  avatar: string;
  socials: Record<string, string>;
  website: string;
  hobbies: string[];
}

export interface CreateProfileDto {
  userId: string;
  fullName: string;
  displayName: string;
}

