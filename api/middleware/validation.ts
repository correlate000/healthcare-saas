import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult, ValidationChain } from 'express-validator'
import validator from 'validator'
import { auditService } from '../services/audit'

// Custom validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string[]> = {}
    
    errors.array().forEach(error => {
      const field = error.type === 'field' ? error.path : 'general'
      if (!formattedErrors[field]) {
        formattedErrors[field] = []
      }
      formattedErrors[field].push(error.msg)
    })

    // Log validation failures for security monitoring
    if (req.user) {
      auditService.log({
        userId: req.user.id,
        action: 'validation_failed',
        resourceType: 'request',
        resourceId: req.path,
        details: {
          method: req.method,
          errors: formattedErrors
        }
      })
    }

    return res.status(400).json({
      success: false,
      message: '入力内容に問題があります',
      errors: formattedErrors
    })
  }
  
  next()
}

// Common validation rules
export const commonValidations = {
  // Email validation with additional checks
  email: () => body('email')
    .trim()
    .notEmpty().withMessage('メールアドレスは必須です')
    .isEmail().withMessage('有効なメールアドレスを入力してください')
    .normalizeEmail()
    .custom((value) => {
      // Additional email validation
      if (!validator.isEmail(value, { 
        allow_utf8_local_part: false,
        require_tld: true,
        allow_ip_domain: false
      })) {
        throw new Error('無効なメールアドレス形式です')
      }
      
      // Block disposable email domains
      const disposableDomains = ['tempmail.com', 'throwaway.email', 'guerrillamail.com']
      const domain = value.split('@')[1]
      if (disposableDomains.includes(domain)) {
        throw new Error('使い捨てメールアドレスは使用できません')
      }
      
      return true
    }),

  // Password validation with strength requirements
  password: () => body('password')
    .trim()
    .notEmpty().withMessage('パスワードは必須です')
    .isLength({ min: 8 }).withMessage('パスワードは8文字以上である必要があります')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('パスワードは大文字・小文字・数字・特殊文字を含む必要があります')
    .custom((value) => {
      // Check for common weak passwords
      const weakPasswords = ['password', 'Password123!', '12345678', 'qwerty']
      if (weakPasswords.some(weak => value.toLowerCase().includes(weak.toLowerCase()))) {
        throw new Error('より強力なパスワードを選択してください')
      }
      return true
    }),

  // Name validation
  name: (field = 'name') => body(field)
    .trim()
    .notEmpty().withMessage('名前は必須です')
    .isLength({ min: 2, max: 100 }).withMessage('名前は2〜100文字で入力してください')
    .matches(/^[a-zA-Zぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠々〆〤\s\-\.]+$/)
    .withMessage('名前に使用できない文字が含まれています'),

  // Phone number validation
  phoneNumber: (field = 'phoneNumber') => body(field)
    .optional()
    .trim()
    .matches(/^(\+81|0)[0-9]{9,10}$/)
    .withMessage('有効な電話番号を入力してください'),

  // Date validation
  date: (field, options = {}) => body(field)
    .optional(options)
    .isISO8601().withMessage('有効な日付形式で入力してください')
    .custom((value) => {
      const date = new Date(value)
      const now = new Date()
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error('無効な日付です')
      }
      
      // Optional: Check if date is not too far in the past
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 150)
      if (date < minDate) {
        throw new Error('日付が古すぎます')
      }
      
      // Optional: Check if date is not in the future
      if (options.noFuture && date > now) {
        throw new Error('未来の日付は入力できません')
      }
      
      return true
    }),

  // UUID validation
  uuid: (field) => param(field)
    .isUUID(4).withMessage('無効なIDです'),

  // Pagination validation
  pagination: () => [
    query('page')
      .optional()
      .isInt({ min: 1, max: 1000 }).withMessage('ページ番号は1〜1000の間で指定してください'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('表示件数は1〜100の間で指定してください')
  ],

  // Sort validation
  sort: (allowedFields: string[]) => query('sort')
    .optional()
    .custom((value) => {
      const sortPattern = /^[a-zA-Z_]+:(asc|desc)$/
      if (!sortPattern.test(value)) {
        throw new Error('無効なソート形式です')
      }
      
      const [field] = value.split(':')
      if (!allowedFields.includes(field)) {
        throw new Error('無効なソートフィールドです')
      }
      
      return true
    }),

  // Health data validation
  healthValue: (field) => body(field)
    .notEmpty().withMessage('値は必須です')
    .custom((value, { req }) => {
      const dataType = req.body.dataType
      
      // Validate based on data type
      switch (dataType) {
        case 'heart_rate':
          if (!validator.isInt(value, { min: 30, max: 250 })) {
            throw new Error('心拍数は30〜250の間で入力してください')
          }
          break
          
        case 'blood_pressure':
          if (!/^\d{2,3}\/\d{2,3}$/.test(value)) {
            throw new Error('血圧は「収縮期/拡張期」の形式で入力してください')
          }
          const [systolic, diastolic] = value.split('/').map(Number)
          if (systolic < 70 || systolic > 250 || diastolic < 40 || diastolic > 150) {
            throw new Error('血圧の値が正常範囲外です')
          }
          if (systolic <= diastolic) {
            throw new Error('収縮期血圧は拡張期血圧より高い必要があります')
          }
          break
          
        case 'temperature':
          if (!validator.isFloat(value, { min: 35.0, max: 42.0 })) {
            throw new Error('体温は35.0〜42.0°Cの間で入力してください')
          }
          break
          
        case 'weight':
          if (!validator.isFloat(value, { min: 20, max: 300 })) {
            throw new Error('体重は20〜300kgの間で入力してください')
          }
          break
      }
      
      return true
    }),

  // File validation
  file: (field = 'file') => body(field)
    .custom((value, { req }) => {
      if (!req.files || !req.files[field]) {
        throw new Error('ファイルがアップロードされていません')
      }
      
      const file = req.files[field]
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('許可されていないファイル形式です')
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('ファイルサイズは10MB以下にしてください')
      }
      
      return true
    })
}

// Sanitization helpers
export const sanitizers = {
  // Escape HTML entities
  escapeHtml: (field: string) => body(field)
    .escape(),

  // Remove scripts and dangerous HTML
  sanitizeHtml: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value !== 'string') return value
      
      // Remove script tags and event handlers
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
        .replace(/on\w+\s*=\s*'[^']*'/gi, '')
        .replace(/javascript:/gi, '')
    }),

  // Normalize whitespace
  normalizeWhitespace: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value !== 'string') return value
      return value.trim().replace(/\s+/g, ' ')
    }),

  // Convert to lowercase
  toLowerCase: (field: string) => body(field)
    .customSanitizer((value) => {
      if (typeof value !== 'string') return value
      return value.toLowerCase()
    })
}

// Validation middleware factory
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)))
    
    // Check for errors
    handleValidationErrors(req, res, next)
  }
}

// Pre-built validation sets
export const validationSets = {
  // User registration
  userRegistration: [
    commonValidations.email(),
    commonValidations.password(),
    commonValidations.name('name'),
    body('agreeTerms')
      .isBoolean().withMessage('利用規約への同意が必要です')
      .equals('true').withMessage('利用規約に同意してください'),
    body('agreePrivacy')
      .isBoolean().withMessage('プライバシーポリシーへの同意が必要です')
      .equals('true').withMessage('プライバシーポリシーに同意してください')
  ],

  // User login
  userLogin: [
    commonValidations.email(),
    body('password')
      .notEmpty().withMessage('パスワードは必須です'),
    body('rememberMe')
      .optional()
      .isBoolean().withMessage('無効な値です')
  ],

  // Health data entry
  healthDataEntry: [
    body('dataType')
      .notEmpty().withMessage('データタイプは必須です')
      .isIn(['heart_rate', 'blood_pressure', 'temperature', 'weight', 'steps', 'symptom', 'medication'])
      .withMessage('無効なデータタイプです'),
    commonValidations.healthValue('value'),
    body('recordedAt')
      .isISO8601().withMessage('有効な日時を入力してください'),
    body('metadata')
      .optional()
      .isObject().withMessage('メタデータは有効なオブジェクトである必要があります')
  ],

  // Profile update
  profileUpdate: [
    commonValidations.name('name').optional(),
    commonValidations.phoneNumber('phoneNumber'),
    commonValidations.date('dateOfBirth', { noFuture: true }),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other']).withMessage('無効な性別です'),
    body('height')
      .optional()
      .isFloat({ min: 50, max: 300 }).withMessage('身長は50〜300cmの間で入力してください'),
    body('bloodType')
      .optional()
      .isIn(['A', 'B', 'O', 'AB']).withMessage('無効な血液型です')
  ]
}