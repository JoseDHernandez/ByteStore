import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Rutas públicas
const publicRoutes = ["/", "/products", "/login", "/register"];

// Patrón para /products/:id
const productDetailPattern = /^\/products\/[^/]+$/;

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const userRole: string = session?.user?.role ?? "";

  const pathname = nextUrl.pathname;
  //Validar rutas publicas
  const isPublic =
    publicRoutes.includes(pathname) || productDetailPattern.test(pathname);
  if (isPublic) {
    return NextResponse.next();
  }
  //Rutas de administración
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl.origin));
    }
    if (userRole.toUpperCase() !== "ADMINISTRADOR") {
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }
    return NextResponse.next();
  }
  //Rutas que necesitan cuenta ej: /account
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
