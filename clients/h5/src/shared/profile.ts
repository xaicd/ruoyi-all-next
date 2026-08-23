import { http } from './http'

export interface ProjectProfile {
  name: string
  shortName: string
  logo: string
  copyright: string
}

export async function fetchProjectProfile(): Promise<ProjectProfile> {
  return http.get('/open/meta/project-profile')
}
