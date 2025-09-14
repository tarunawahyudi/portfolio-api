import { AwardResponse } from '@module/award/dto/award.dto'
import { Award } from '@module/award/entity/award'

export function toAwardResponse(award: Award): AwardResponse {
  return {
    id: award.id,
    title: award.title,
    description: award.description ?? '',
  }
}
