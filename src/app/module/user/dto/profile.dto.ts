export interface ProfileResponse {
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
