import { Setting } from '@module/setting/entity/setting'
import { SettingResponse } from '@module/setting/dto/setting.dto'

export function toSettingResponse(setting: Setting): SettingResponse {
  return {
    id: setting.id,
    key: setting.key,
    value: setting.value,
  }
}
