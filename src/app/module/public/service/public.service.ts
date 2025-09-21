import { PublicProfileResponse } from '@module/public/dto/public.dto'

export interface PublicService {
  getPublicProfile(username: string): Promise<PublicProfileResponse>
}
