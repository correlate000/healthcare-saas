'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { apiClient, type User, type LoginRequest, type RegisterRequest } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  emailVerified?: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  register: (userData: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  verifyEmail: (token: string) => Promise<boolean>
  resendVerificationEmail: () => Promise<boolean>
  refreshUserData: () => Promise<void>
  hasCheckedInToday: () => boolean
  markCheckedInToday: () => void
  isAdmin: () => boolean
  isEnterpriseAdmin: () => boolean
  isSuperAdmin: () => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    emailVerified: false
  })

  // Token refresh interval
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;

    const startTokenRefresh = () => {
      // Refresh token every 14 minutes (tokens expire in 15 minutes)
      refreshInterval = setInterval(async () => {
        if (authState.isAuthenticated) {
          try {
            await apiClient.refreshToken();
          } catch (error) {
            console.error('Token refresh failed:', error);
            handleLogout();
          }
        }
      }, 14 * 60 * 1000);
    };

    if (authState.isAuthenticated) {
      startTokenRefresh();
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [authState.isAuthenticated]);

  // Check for existing auth state on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if we have a stored token
        const storedToken = localStorage.getItem('healthcareapp_token');
        const storedUser = localStorage.getItem('healthcareapp_user');
        
        if (storedToken && storedUser) {
          // Set initial state from stored data immediately
          try {
            const parsedUser = JSON.parse(storedUser);
            setAuthState({
              isAuthenticated: true,
              user: parsedUser,
              isLoading: false,
              emailVerified: parsedUser.emailVerified
            });
          } catch (parseError) {
            // If stored user data is invalid, clear it
            localStorage.removeItem('healthcareapp_user');
            localStorage.removeItem('healthcareapp_token');
          }
          
          // Optionally verify the token is still valid in the background
          // This won't block the initial render
          apiClient.getCurrentUser().then(response => {
            if (!response.success || !response.data) {
              // Token is invalid, clear auth state
              apiClient.clearAuthToken();
              setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                emailVerified: false
              });
            }
          }).catch(() => {
            // Ignore errors for now, user can still use the app
            console.log('Background auth check failed, continuing with stored data');
          });
          
          return;
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        // Clear invalid auth data
        apiClient.clearAuthToken();
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        emailVerified: false
      });
    };

    checkAuthState();
  }, [])

  const handleLogout = useCallback(() => {
    apiClient.clearAuthToken();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      emailVerified: false
    });
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const response = await apiClient.login({ email, password, rememberMe });
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
          emailVerified: response.data.user.emailVerified
        });

        toast({
          title: "ログイン成功",
          description: "正常にログインしました。",
        });

        return true;
      } else {
        const errorMessage = response.message || 'ログインに失敗しました。';
        toast({
          title: "ログインエラー",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "ログインエラー",
        description: "ログイン中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false,
          emailVerified: response.data.user.emailVerified
        });

        toast({
          title: "登録成功",
          description: "アカウントが正常に作成されました。メール認証を確認してください。",
        });

        return true;
      } else {
        const errorMessage = response.message || '登録に失敗しました。';
        
        // Handle validation errors
        if (response.errors) {
          const firstError = Object.values(response.errors)[0];
          toast({
            title: "入力エラー",
            description: Array.isArray(firstError) ? firstError[0] : firstError,
            variant: "destructive",
          });
        } else {
          toast({
            title: "登録エラー",
            description: errorMessage,
            variant: "destructive",
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "登録エラー",
        description: "登録中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
      
      toast({
        title: "ログアウト",
        description: "正常にログアウトしました。",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local auth state
    } finally {
      handleLogout();
      
      // Clear all app-specific data
      localStorage.removeItem('mindcare-last-checkin');
      localStorage.removeItem('mindcare-setup');
      localStorage.removeItem('mindcare-widgets');
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await apiClient.forgotPassword({ email });
      
      if (response.success) {
        toast({
          title: "パスワードリセット",
          description: "パスワードリセット用のメールを送信しました。",
        });
        return true;
      } else {
        toast({
          title: "エラー",
          description: response.message || "パスワードリセット要求に失敗しました。",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "エラー",
        description: "パスワードリセット要求中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await apiClient.resetPassword({ token, newPassword });
      
      if (response.success) {
        toast({
          title: "パスワードリセット成功",
          description: "パスワードが正常に変更されました。",
        });
        return true;
      } else {
        toast({
          title: "エラー",
          description: response.message || "パスワードのリセットに失敗しました。",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "エラー",
        description: "パスワードリセット中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await apiClient.changePassword({ currentPassword, newPassword });
      
      if (response.success) {
        toast({
          title: "パスワード変更成功",
          description: "パスワードが正常に変更されました。",
        });
        return true;
      } else {
        toast({
          title: "エラー",
          description: response.message || "パスワードの変更に失敗しました。",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast({
        title: "エラー",
        description: "パスワード変更中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.verifyEmail(token);
      
      if (response.success) {
        // Refresh user data to update emailVerified status
        await refreshUserData();
        
        toast({
          title: "メール認証成功",
          description: "メールアドレスが正常に認証されました。",
        });
        return true;
      } else {
        toast({
          title: "エラー",
          description: response.message || "メール認証に失敗しました。",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Email verification error:', error);
      toast({
        title: "エラー",
        description: "メール認証中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const resendVerificationEmail = async (): Promise<boolean> => {
    try {
      const response = await apiClient.resendVerificationEmail();
      
      if (response.success) {
        toast({
          title: "認証メール送信",
          description: "認証メールを再送信しました。",
        });
        return true;
      } else {
        toast({
          title: "エラー",
          description: response.message || "認証メールの再送信に失敗しました。",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast({
        title: "エラー",
        description: "認証メール送信中にエラーが発生しました。",
        variant: "destructive",
      });
      return false;
    }
  }

  const refreshUserData = async (): Promise<void> => {
    try {
      const response = await apiClient.getCurrentUser();
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data!,
          emailVerified: response.data!.emailVerified
        }));
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
  }

  const hasCheckedInToday = (): boolean => {
    const today = new Date().toDateString()
    const lastCheckin = localStorage.getItem('mindcare-last-checkin')
    return lastCheckin === today
  }

  const markCheckedInToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem('mindcare-last-checkin', today)
  }

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin' || authState.user?.role === 'enterprise-admin' || authState.user?.role === 'super-admin'
  }

  const isEnterpriseAdmin = (): boolean => {
    return authState.user?.role === 'enterprise-admin' || authState.user?.role === 'super-admin'
  }

  const isSuperAdmin = (): boolean => {
    return authState.user?.role === 'super-admin'
  }

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions?.includes(permission) || false
  }

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    refreshUserData,
    hasCheckedInToday,
    markCheckedInToday,
    isAdmin,
    isEnterpriseAdmin,
    isSuperAdmin,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}