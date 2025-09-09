// This file augments the NextAuth types to include custom properties
// like accessToken and error in the Session and JWT objects.

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and `getAuth`
   * and can be augmented to have a custom `accessToken` property.
   */
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and can be augmented to have a custom
   * `accessToken`, `refreshToken`, and `accessTokenExpires` property.
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
