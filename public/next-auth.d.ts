// next-auth.d.ts (place this file in your project root or types folder)

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']; // This keeps the other user properties like name, email, etc.
  }

  interface User {
    id: string;
  }
}
