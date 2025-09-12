import { Media, NewMedia } from '@module/media/entity/media'

export interface MediaRepository {
  create(data: NewMedia): Promise<Media>;
  findById(id: string): Promise<Media | null>;
  delete(id: string, userId: string, ownerType: 'portfolio'): Promise<Media | null>;
}
