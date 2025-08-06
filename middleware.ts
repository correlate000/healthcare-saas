import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 一時的に認証チェックを無効化（テスト用）
  return NextResponse.next()
  
  /* 以下は本番用のコード（現在は無効化）
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // 公開ページのリスト
  const publicPages = ['/auth', '/splash', '/consent', '/']
  const isPublicPage = publicPages.some(page => pathname === page || pathname.startsWith(`${page}/`))

  // 認証が必要なページにアクセスしようとしている場合
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // 認証済みユーザーが認証ページにアクセスしようとしている場合
  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}