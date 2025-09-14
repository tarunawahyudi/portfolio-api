export interface CreateSettingRequest {
  key: string;
  value: string;
}

export interface SettingResponse {
  id: number;
  key: string;
  value: string;
}
