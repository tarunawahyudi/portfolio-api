import { ProfileWithEmail } from '@module/user/entity/profileWithEmail'
import { ProfileResponse } from '@module/user/dto/profile.dto'
import { cdnUrl } from '@shared/util/common.util'

export function toProfileResponse(profile: ProfileWithEmail): ProfileResponse {
  return {
    fullName: profile.fullName ?? '',
    bio: profile.bio ?? '',
    userId: profile.userId,
    username: profile.username,
    email: profile.email,
    phoneNumber: profile.phoneNumber ?? '',
    displayName: profile.displayName ?? '',
    website: profile.website ?? '',
    address: profile.address ?? '',
    socials: profile.socials ?? {},
    avatarUrl: cdnUrl(profile.avatar) ?? '',
    hobbies: profile.hobbies ?? [],
    jobTitle: profile.jobTitle ?? '',
    appearance: profile.appearance ?? null,
  }
}
