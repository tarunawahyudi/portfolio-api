import { cdnUrl } from '@shared/util/common.util'
import { MediaResponse } from '@module/media/dto/media.dto'
import { Media } from '@module/media/entity/media'

export function toMediaResponse(media: Media): MediaResponse {
  return { id: media.id, url: cdnUrl(media.fileKey) }
}
