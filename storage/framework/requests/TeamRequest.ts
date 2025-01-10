import type { TeamRequestType } from '../types/requests'
import { Request } from '@stacksjs/router'
import { customValidate, validateField } from '@stacksjs/validation'

interface ValidationField {
  rule: ReturnType<typeof schema.string>
  message: Record<string, string>
}

interface CustomAttributes {
  [key: string]: ValidationField
}
interface RequestDataTeam {
  id: number
  name: string
  company_name: string
  email: string
  billing_email: string
  status: string
  description: string
  path: string
  is_personal: boolean
  user_id: number
  created_at?: Date
  updated_at?: Date
}
export class TeamRequest extends Request<RequestDataTeam> implements TeamRequestType {
  public id = 1
  public name = ''
  public company_name = ''
  public email = ''
  public billing_email = ''
  public status = ''
  public description = ''
  public path = ''
  public is_personal = false
  public user_id = 0
  public created_at = new Date()
  public updated_at = new Date()

  public async validate(attributes?: CustomAttributes): Promise<void> {
    if (attributes === undefined || attributes === null) {
      await validateField('Team', this.all())
    }
    else {
      await customValidate(attributes, this.all())
    }
  }
}

export const request = new TeamRequest()
