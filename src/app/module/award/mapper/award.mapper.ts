import { Award } from '@module/award/entity/award'
import { AwardResponse } from '@module/award/dto/award.dto'
import { cdnUrl } from '@shared/util/common.util'

export function toAwardResponse(award: Award): AwardResponse {
  return {
    id: award.id,
    title: award.title,
    description: award.description ?? '',
    images:
      award.images
        ?.map((key) => cdnUrl(key))
        .filter((url): url is string => !!url)
      ?? [],
  }
}
