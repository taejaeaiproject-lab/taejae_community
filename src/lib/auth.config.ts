import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const publicPaths = ["/", "/login", "/register", "/pending"];
      const isPublic = publicPaths.some((p) => pathname.startsWith(p)) || pathname.startsWith("/api/auth");

      if (!isLoggedIn && !isPublic) return false;

      if (pathname.startsWith("/admin")) {
        const role = auth?.user?.role;
        if (role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
