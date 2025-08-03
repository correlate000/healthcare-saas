import { 
  validateEmail, 
  validatePassword, 
  validateHealthData,
  sanitizeInput 
} from '@/lib/validation'

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.jp',
        'admin+tag@company.org',
        'user123@test-domain.net'
      ]

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain'
      ]

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false)
      })
      
      // Empty string should also be false
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'Complex@Password456',
        'MySecure#Pass789'
      ]

      strongPasswords.forEach(password => {
        console.log(`Testing password: ${password}`)
        expect(validatePassword(password)).toBe(true)
      })
    })

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'weak',
        '12345678',
        'password',
        'PASSWORD',
        'Pass123', // too short
        'weakpassword123' // no special chars or uppercase
      ]

      weakPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false)
      })
    })
  })

  describe('validateHealthData', () => {
    it('should validate correct health data', () => {
      const validData = {
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 72,
        weight: 70.5,
        height: 175,
        symptoms: ['headache', 'fatigue']
      }

      expect(validateHealthData(validData)).toBe(true)
    })

    it('should reject invalid health data', () => {
      const invalidDataSets = [
        { bloodPressure: { systolic: 300, diastolic: 80 } }, // impossible systolic
        { bloodPressure: { systolic: 120, diastolic: 200 } }, // impossible diastolic
        { heartRate: 300 }, // too high
        { weight: -10 }, // negative
        { height: 300 }, // too tall
      ]

      invalidDataSets.forEach(data => {
        expect(validateHealthData(data)).toBe(false)
      })
      
      // Empty object should be true (no data to validate)
      expect(validateHealthData({})).toBe(true)
    })
  })

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const inputs = [
        { input: '<script>alert("xss")</script>', expected: 'alert("xss")' },
        { input: 'Normal text', expected: 'Normal text' },
        { input: 'Text with <b>bold</b>', expected: 'Text with bold' },
        { input: "'; DROP TABLE users; --", expected: "'; DROP TABLE users; --" }
      ]

      inputs.forEach(({ input, expected }) => {
        expect(sanitizeInput(input)).toBe(expected)
      })
    })

    it('should handle empty and null inputs', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })
  })
})