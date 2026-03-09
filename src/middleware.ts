import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas que não precisam de autenticação
const publicPaths = ["/auth/login", "/auth/confirm"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se é uma rota pública
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Permite acesso às rotas públicas
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Para rotas protegidas, a verificação será feita no cliente
  // via AuthProvider no layout
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - _next (Next.js internals)
     */
    "/((?!api|_next/static|_next/image|_next|favicon.ico).*)",
  ],
};
