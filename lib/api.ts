// API Client Service
// Comprehensive HTTP client for communicating with the Healthcare SaaS API
import { toast } from '@/hooks/use-toast';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  company?: string;
  department?: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'enterprise-admin' | 'super-admin';
  permissions: string[];
  company?: {
    id: string;
    name: string;
  };
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

interface PasswordResetRequest {
  email: string;
}

interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    // Use relative URL for mock API in production
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    
    // Try to get token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('healthcareapp_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api/v1${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Important for HTTP-only cookies
    };

    try {
      const response = await fetch(url, config);
      
      // Handle network errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle authentication errors
        if (response.status === 401) {
          this.handleAuthError();
          throw new Error('認証が必要です。再度ログインしてください。');
        }
        
        // Handle validation errors
        if (response.status === 400 && errorData.errors) {
          return {
            success: false,
            errors: errorData.errors,
            message: errorData.message || '入力内容に問題があります。'
          };
        }
        
        // Handle rate limiting
        if (response.status === 429) {
          throw new Error('リクエストが多すぎます。しばらく待ってから再試行してください。');
        }
        
        // Handle server errors
        if (response.status >= 500) {
          throw new Error('サーバーエラーが発生しました。しばらく待ってから再試行してください。');
        }
        
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('API Request Error:', error);
      
      // Network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください。');
      }
      
      throw error;
    }
  }

  private handleAuthError() {
    // Clear stored auth data
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('healthcareapp_token');
      localStorage.removeItem('healthcareapp_user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
  }

  setAuthToken(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthcareapp_token', token);
    }
  }

  clearAuthToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('healthcareapp_token');
      localStorage.removeItem('healthcareapp_user');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Use mock API endpoint for now
      const response = await this.request<AuthResponse>('/api/auth/mock-login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data) {
        this.setAuthToken(response.data.accessToken);
        
        // Store user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('healthcareapp_user', JSON.stringify(response.data.user));
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '登録に失敗しました。'
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success && response.data) {
        this.setAuthToken(response.data.accessToken);
        
        // Store user data
        if (typeof window !== 'undefined') {
          localStorage.setItem('healthcareapp_user', JSON.stringify(response.data.user));
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ログインに失敗しました。'
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST',
      });

      // Clear auth data regardless of response
      this.clearAuthToken();

      return response;
    } catch (error) {
      // Clear auth data even if logout request fails
      this.clearAuthToken();
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ログアウトに失敗しました。'
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    try {
      const response = await this.request<{ accessToken: string; expiresIn: number }>('/auth/refresh', {
        method: 'POST',
      });

      if (response.success && response.data) {
        this.setAuthToken(response.data.accessToken);
      }

      return response;
    } catch (error) {
      this.handleAuthError();
      return {
        success: false,
        message: error instanceof Error ? error.message : 'トークンの更新に失敗しました。'
      };
    }
  }

  async forgotPassword(data: PasswordResetRequest): Promise<ApiResponse> {
    try {
      return await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'パスワードリセット要求に失敗しました。'
      };
    }
  }

  async resetPassword(data: PasswordResetConfirm): Promise<ApiResponse> {
    try {
      return await this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'パスワードのリセットに失敗しました。'
      };
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    try {
      return await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'パスワードの変更に失敗しました。'
      };
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      return await this.request(`/auth/verify-email/${token}`, {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'メール認証に失敗しました。'
      };
    }
  }

  async resendVerificationEmail(): Promise<ApiResponse> {
    try {
      return await this.request('/auth/resend-verification', {
        method: 'POST',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '認証メールの再送信に失敗しました。'
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await this.request<User>('/auth/me', {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ユーザー情報の取得に失敗しました。'
      };
    }
  }

  async getUserSessions(): Promise<ApiResponse<any[]>> {
    try {
      return await this.request<any[]>('/auth/sessions', {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'セッション情報の取得に失敗しました。'
      };
    }
  }

  async revokeSession(sessionId: string): Promise<ApiResponse> {
    try {
      return await this.request(`/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'セッションの削除に失敗しました。'
      };
    }
  }

  // Health Data endpoints
  async getHealthProfile(): Promise<ApiResponse<any>> {
    try {
      return await this.request('/health-data/profile', {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康プロフィールの取得に失敗しました。'
      };
    }
  }

  async updateHealthProfile(data: any): Promise<ApiResponse<any>> {
    try {
      return await this.request('/health-data/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康プロフィールの更新に失敗しました。'
      };
    }
  }

  async getHealthDataEntries(params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/health-data/entries${queryParams.toString() ? `?${queryParams}` : ''}`;
      return await this.request<any[]>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの取得に失敗しました。'
      };
    }
  }

  async createHealthDataEntry(data: any): Promise<ApiResponse<any>> {
    try {
      return await this.request('/health-data/entries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの作成に失敗しました。'
      };
    }
  }

  async deleteHealthDataEntry(id: string): Promise<ApiResponse> {
    try {
      return await this.request(`/health-data/entries/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの削除に失敗しました。'
      };
    }
  }

  // AI Analysis endpoints
  async analyzeSymptoms(data: {
    symptoms: any[];
    vitalSigns?: any;
    context?: any;
  }): Promise<ApiResponse<any>> {
    try {
      return await this.request('/ai/analyze/symptoms', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'AI症状分析に失敗しました。'
      };
    }
  }

  async getHealthTrends(userId: string, metrics: string[], days: number = 30): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams({
        metrics: metrics.join(','),
        days: days.toString()
      });

      return await this.request<any[]>(`/ai/trends/${userId}?${params}`, {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康トレンドの取得に失敗しました。'
      };
    }
  }

  async getHealthPredictions(userId: string): Promise<ApiResponse<any>> {
    try {
      return await this.request(`/ai/predictions/${userId}`, {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康予測の取得に失敗しました。'
      };
    }
  }

  // File upload endpoints
  async uploadFile(file: File, metadata?: any): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      return await this.request('/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData - browser will set it with boundary
        } as any,
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました。'
      };
    }
  }

  async uploadMultipleFiles(files: File[], metadata?: any): Promise<ApiResponse<any[]>> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      return await this.request('/files/upload-multiple', {
        method: 'POST',
        body: formData,
        headers: {} as any,
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました。'
      };
    }
  }

  async getUserFiles(params?: {
    type?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/files${queryParams.toString() ? `?${queryParams}` : ''}`;
      return await this.request<any[]>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ファイル一覧の取得に失敗しました。'
      };
    }
  }

  async deleteFile(id: string): Promise<ApiResponse> {
    try {
      return await this.request(`/files/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'ファイルの削除に失敗しました。'
      };
    }
  }

  getFileDownloadUrl(id: string): string {
    return `${this.baseURL}/api/v1/files/${id}/download${this.accessToken ? `?token=${this.accessToken}` : ''}`;
  }

  getFileThumbnailUrl(id: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    return `${this.baseURL}/api/v1/files/${id}/thumbnail/${size}${this.accessToken ? `?token=${this.accessToken}` : ''}`;
  }

  // New Health API methods
  async createHealthEntry(data: any): Promise<ApiResponse<any>> {
    try {
      return await this.request('/health/entries', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの作成に失敗しました。'
      };
    }
  }

  async getHealthEntries(params?: any): Promise<ApiResponse<any[]>> {
    try {
      const queryString = params ? `?${new URLSearchParams(params)}` : '';
      return await this.request(`/health/entries${queryString}`, {
        method: 'GET'
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの取得に失敗しました。'
      };
    }
  }

  async updateHealthEntry(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      return await this.request(`/health/entries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの更新に失敗しました。'
      };
    }
  }

  async deleteHealthEntry(id: string): Promise<ApiResponse> {
    try {
      return await this.request(`/health/entries/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの削除に失敗しました。'
      };
    }
  }

  async getHealthSummary(days?: number): Promise<ApiResponse<any>> {
    try {
      const params = days ? `?days=${days}` : '';
      return await this.request(`/health/summary${params}`, {
        method: 'GET'
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康サマリーの取得に失敗しました。'
      };
    }
  }

  async getHealthTrendsData(metric: string, days?: number): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams({ metric });
      if (days) params.append('days', days.toString());
      return await this.request(`/health/trends?${params}`, {
        method: 'GET'
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康トレンドの取得に失敗しました。'
      };
    }
  }

  async analyzeHealthData(dataType: string, timeRange?: number): Promise<ApiResponse<any>> {
    try {
      return await this.request('/health/analyze', {
        method: 'POST',
        body: JSON.stringify({ dataType, timeRange })
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの分析に失敗しました。'
      };
    }
  }

  async batchCreateHealthEntries(entries: any[]): Promise<ApiResponse<any[]>> {
    try {
      return await this.request('/health/batch', {
        method: 'POST',
        body: JSON.stringify({ entries })
      });
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : '健康データの一括作成に失敗しました。'
      };
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Simple API request function for tests
export async function apiRequest(
  endpoint: string,
  options?: {
    method?: string;
    data?: any;
    headers?: Record<string, string>;
  }
): Promise<any> {
  const method = options?.method || 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (options?.data && method !== 'GET') {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}

// Helper function to check if an object is an API error
export function isApiError(obj: any): boolean {
  return obj !== null && obj !== undefined && typeof obj === 'object' && 'error' in obj;
}

// Export types for use in components
export type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest
};