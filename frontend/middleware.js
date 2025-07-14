import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/about", "/pricing"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
