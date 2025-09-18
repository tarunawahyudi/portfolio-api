export interface CreateSkillRequest {
  userId: string
  name: string
  proficiency: number
  category: string
}

export interface UpdateSkillRequest {
  name?: string
  proficiency?: number
  category?: string
}

export interface SkillResponse {
  id: string
  name: string
  proficiency: number
  category: string
}
