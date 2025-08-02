// Frontend validation utilities
// Comprehensive input validation for forms and user input

export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Common validation patterns
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phoneJapan: /^(\+81|0)[0-9]{9,10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  hiragana: /^[ぁ-ん]+$/,
  katakana: /^[ァ-ヶｱ-ﾝﾞﾟ]+$/,
  kanji: /^[一-龠々〆〤]+$/,
  japaneseText: /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠々〆〤\s]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  bloodPressure: /^\d{2,3}\/\d{2,3}$/
}

// Validation rules factory
export const validators = {
  // Required field validation
  required: (message = '必須項目です'): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined) return false
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return true
    },
    message
  }),

  // Email validation
  email: (message = '有効なメールアドレスを入力してください'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true // Use with required for mandatory fields
      return patterns.email.test(value)
    },
    message
  }),

  // Minimum length validation
  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return value.length >= min
    },
    message: message || `${min}文字以上で入力してください`
  }),

  // Maximum length validation
  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return value.length <= max
    },
    message: message || `${max}文字以下で入力してください`
  }),

  // Number range validation
  between: (min: number, max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined || value === '') return true
      const num = Number(value)
      return !isNaN(num) && num >= min && num <= max
    },
    message: message || `${min}から${max}の間で入力してください`
  }),

  // Pattern matching validation
  pattern: (pattern: RegExp, message: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return pattern.test(value)
    },
    message
  }),

  // Password strength validation
  password: (message = 'パスワードは8文字以上で、大文字・小文字・数字・特殊文字を含む必要があります'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return value.length >= 8 && patterns.password.test(value)
    },
    message
  }),

  // Password confirmation validation
  passwordMatch: (password: string, message = 'パスワードが一致しません'): ValidationRule => ({
    validate: (value) => {
      return value === password
    },
    message
  }),

  // Japanese phone number validation
  phoneNumber: (message = '有効な電話番号を入力してください（例：090-1234-5678）'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      const cleaned = value.replace(/[-\s]/g, '')
      return patterns.phoneJapan.test(cleaned)
    },
    message
  }),

  // Date validation
  date: (options: { 
    min?: Date, 
    max?: Date, 
    noFuture?: boolean,
    noPast?: boolean 
  } = {}): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      
      const date = new Date(value)
      if (isNaN(date.getTime())) return false
      
      const now = new Date()
      
      if (options.noFuture && date > now) return false
      if (options.noPast && date < now) return false
      if (options.min && date < options.min) return false
      if (options.max && date > options.max) return false
      
      return true
    },
    message: 
      options.noFuture ? '未来の日付は選択できません' :
      options.noPast ? '過去の日付は選択できません' :
      options.min && options.max ? `${options.min.toLocaleDateString()}から${options.max.toLocaleDateString()}の間で選択してください` :
      options.min ? `${options.min.toLocaleDateString()}以降の日付を選択してください` :
      options.max ? `${options.max.toLocaleDateString()}以前の日付を選択してください` :
      '有効な日付を選択してください'
  }),

  // Japanese text validation
  japanese: (options: {
    allowHiragana?: boolean,
    allowKatakana?: boolean,
    allowKanji?: boolean,
    allowSpace?: boolean
  } = { 
    allowHiragana: true, 
    allowKatakana: true, 
    allowKanji: true, 
    allowSpace: true 
  }): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      
      let pattern = '^['
      if (options.allowHiragana) pattern += 'ぁ-ん'
      if (options.allowKatakana) pattern += 'ァ-ヶｱ-ﾝﾞﾟ'
      if (options.allowKanji) pattern += '一-龠々〆〤'
      if (options.allowSpace) pattern += '\\s'
      pattern += ']+$'
      
      return new RegExp(pattern).test(value)
    },
    message: '日本語で入力してください'
  }),

  // URL validation
  url: (message = '有効なURLを入力してください'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      return patterns.url.test(value)
    },
    message
  }),

  // Custom validation
  custom: (validateFn: (value: any) => boolean, message: string): ValidationRule => ({
    validate: validateFn,
    message
  }),

  // Health data specific validations
  heartRate: (): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      const num = Number(value)
      return !isNaN(num) && num >= 30 && num <= 250
    },
    message: '心拍数は30〜250の間で入力してください'
  }),

  bloodPressure: (): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      if (!patterns.bloodPressure.test(value)) return false
      
      const [systolic, diastolic] = value.split('/').map(Number)
      return systolic >= 70 && systolic <= 250 && 
             diastolic >= 40 && diastolic <= 150 &&
             systolic > diastolic
    },
    message: '血圧は「収縮期/拡張期」の形式で入力してください（例：120/80）'
  }),

  temperature: (): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      const num = Number(value)
      return !isNaN(num) && num >= 35.0 && num <= 42.0
    },
    message: '体温は35.0〜42.0°Cの間で入力してください'
  }),

  weight: (): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      const num = Number(value)
      return !isNaN(num) && num >= 20 && num <= 300
    },
    message: '体重は20〜300kgの間で入力してください'
  }),

  height: (): ValidationRule => ({
    validate: (value) => {
      if (!value) return true
      const num = Number(value)
      return !isNaN(num) && num >= 50 && num <= 250
    },
    message: '身長は50〜250cmの間で入力してください'
  })
}

// Validation runner
export class Validator {
  private rules: Map<string, ValidationRule[]> = new Map()

  // Add validation rules for a field
  addRule(field: string, rule: ValidationRule | ValidationRule[]): this {
    const rules = Array.isArray(rule) ? rule : [rule]
    const existing = this.rules.get(field) || []
    this.rules.set(field, [...existing, ...rules])
    return this
  }

  // Validate a single field
  validateField(field: string, value: any): ValidationResult {
    const rules = this.rules.get(field) || []
    const errors: string[] = []

    for (const rule of rules) {
      if (!rule.validate(value)) {
        errors.push(rule.message)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Validate all fields
  validate(data: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {}

    Array.from(this.rules.entries()).forEach(([field, rules]) => {
      results[field] = this.validateField(field, data[field])
    })

    return results
  }

  // Check if all fields are valid
  isValid(data: Record<string, any>): boolean {
    const results = this.validate(data)
    return Object.values(results).every(result => result.isValid)
  }

  // Get all errors
  getErrors(data: Record<string, any>): Record<string, string[]> {
    const results = this.validate(data)
    const errors: Record<string, string[]> = {}

    for (const [field, result] of Object.entries(results)) {
      if (!result.isValid) {
        errors[field] = result.errors
      }
    }

    return errors
  }

  // Clear all rules
  clear(): this {
    this.rules.clear()
    return this
  }

  // Clear rules for specific field
  clearField(field: string): this {
    this.rules.delete(field)
    return this
  }
}

// Sanitization utilities
export const sanitize = {
  // Remove HTML tags
  stripHtml: (value: string): string => {
    if (!value) return value
    return value.replace(/<[^>]*>/g, '')
  },

  // Escape HTML entities
  escapeHtml: (value: string): string => {
    if (!value) return value
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return value.replace(/[&<>"']/g, char => map[char])
  },

  // Normalize whitespace
  normalizeWhitespace: (value: string): string => {
    if (!value) return value
    return value.trim().replace(/\s+/g, ' ')
  },

  // Remove non-printable characters
  removeNonPrintable: (value: string): string => {
    if (!value) return value
    return value.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
  },

  // Format phone number
  formatPhoneNumber: (value: string): string => {
    if (!value) return value
    const cleaned = value.replace(/\D/g, '')
    
    if (cleaned.startsWith('81')) {
      // International format
      return `+${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
    } else if (cleaned.startsWith('0')) {
      // Domestic format
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    }
    
    return value
  },

  // Format date
  formatDate: (value: string | Date, format = 'YYYY-MM-DD'): string => {
    if (!value) return value as string
    
    const date = value instanceof Date ? value : new Date(value)
    if (isNaN(date.getTime())) return value as string
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
  }
}

// Form validation hook helper
export function createFormValidator<T extends Record<string, any>>(
  rules: Record<keyof T, ValidationRule[]>
): Validator {
  const validator = new Validator()
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    validator.addRule(field, fieldRules as ValidationRule[])
  }
  
  return validator
}