import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { join } from 'path'
import {AppYamlConfig} from "@shared/type/config"

function injectEnv(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\$\{(\w+)}/g, (_, name) => process.env[name] || '')
  } else if (Array.isArray(obj)) {
    return obj.map(injectEnv)
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {}
    for (const key in obj) {
      newObj[key] = injectEnv(obj[key])
    }
    return newObj
  }
  return obj
}

const yamlText = readFileSync(join(process.cwd(), 'application.yaml'), 'utf8')
const rawYaml = parse(yamlText)
const config: AppYamlConfig = injectEnv(rawYaml)

export default config
