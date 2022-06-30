// https://next-auth.js.org/getting-started/example

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export interface Credentials {
    password?: string;
    username?: string;
}

export default NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'user name' },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
            },
            async authorize(credentials) {
                if (
                    credentials?.username === process.env.CREDENTIAL_USERNAME &&
                    credentials?.password === process.env.CREDENTIAL_PASSWORD
                ) {
                    return {
                        name: process.env.CREDENTIAL_USERNAME,
                        id: 999,
                        email: process.env.CREDENTIAL_USERNAME + '@easter.egg',
                    };
                }
                return null;
            },
        }),
        // // https://next-auth.js.org/providers/google
        // Providers.Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
        // // https://next-auth.js.org/providers/okta
        // Providers.Okta({
        //     clientId: process.env.OKTA_CLIENT_ID,
        //     clientSecret: process.env.OKTA_CLIENT_SECRET,
        //     domain: process.env.OKTA_DOMAIN,
        // }),
    ],
    secret: process.env.SECRET,
    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        // signIn: async (user, account, profile) => { return Promise.resolve(true) },
        // redirect: async (url, baseUrl) => { return Promise.resolve(baseUrl) },
        // session: async (session, user) => { return Promise.resolve(session) },
        // jwt: async (token, user, account, profile, isNewUser) => { return Promise.resolve(token) }
    },
    debug: false,
});
