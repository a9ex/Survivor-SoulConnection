import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, type NextAuthOptions, type Session, type User, type DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      jwt?: string;
      id?: number;
      role: string;
    } & DefaultSession['user'];
  }
  interface User {
    jwt?: string;
    id?: number;
    role: string;
  }
}

interface CredentialsLogin {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    image: string;
    role: string;
  };
}

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!res.ok) return null;

          const data: CredentialsLogin = await res.json();

          return {
            jwt: data.access_token,
            email: data.user.email,
            name: data.user.name,
            id: data.user.id,
            image: data.user.image,
            role: data.user.role,
          } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: User | AdapterUser }): Promise<JWT> => {
      if (user) {
        token = Object.assign({}, token, { jwt: user.jwt });
        token = Object.assign({}, token, { id: user.id });
        token = Object.assign({}, token, { role: user.role });
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token) {
        session.user = Object.assign({}, session.user, { jwt: token.jwt });
        session.user = Object.assign({}, session.user, { id: token.id });
        session.user = Object.assign({}, session.user, { role: token.role });
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
} satisfies NextAuthOptions;

export function auth(
  ...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, authOptions);
}
