// https://next-auth.js.org/getting-started/example

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { getCsrfToken } from 'next-auth/react';
import fetcher from '@/libs/fetcher';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || '');
          if (siwe.domain !== nextAuthUrl.host) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(credentials?.signature || '');
          const { data } = await fetcher('/auth/login', 'POST', {
            dataObj: {
              walletAddress: siwe.address,
            },
          });

          return {
            id: data.user.id,
            address: siwe.address,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage = req.method === 'GET' && req.query.nextauth?.includes('signin');

  // Hides Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  console.log(req.method, req.url, req.query, req.body);
  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.SECRET,
    callbacks: {
      async session({ session, token }) {
        session.user = {
          id: token.sub,
          address: token.address,
          name: token.name,
          email: token.email,
          image: 'https://www.fillmurray.com/128/128',
        };
        console.log(session);
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.address = user.address as string;
        }
        return token;
      },
    },
    debug: false,
  });
}
