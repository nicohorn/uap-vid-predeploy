import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'
import getCollections, { CollectionName } from '../../../utils/bd/getCollection'

import CredentialsProvider from 'next-auth/providers/credentials'

import { compare } from 'bcryptjs'
export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
        }),

        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@uap.edu.ar',
                },
                password: { label: 'Contraseña', type: 'password' },
            },
            async authorize(credentials) {
                const users = await getCollections(CollectionName.Users)
                //Find user with the email
                const result = await users.findOne({
                    email: credentials.email,
                })
                //NextAuth maneja el error
                if (!result) {
                    throw new Error('No user found with thar email')
                }

                //Check hased password with DB password
                const checkPassword = await compare(
                    credentials.password,
                    result.password
                )

                if (!checkPassword) {
                    throw new Error("Password doesn't match")
                }
                return {
                    email: result.email,
                    id: result._id,
                    role: result.role,
                }
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user }) => {
            console.log('signIN**********')
            const users = await getCollections(CollectionName.Users)
            const userExist = await users.findOne({ email: user.email })
            console.log('userExist', userExist)
            const updateObject =
                userExist && userExist.role
                    ? { lastLogin: new Date() }
                    : { role: 'new-user', lastLogin: new Date() }

            console.log('actualizamos', updateObject)

            if (userExist) {
                await users.updateOne(
                    { email: user.email },
                    { $set: updateObject }
                )
                console.log('update')
            } else {
                await users.insertOne({ ...user, ...updateObject })
                console.log('insert')
            }
            console.log('casi casi')
            return true
        },
        jwt: ({ token, user }) => {
            console.log('jwt*************')
            if (user) {
                token.user = user
            }
            return token
        },
        session: async ({ session, token }) => {
            console.log('session*************')
            if (token) {
                const users = await getCollections(CollectionName.Users)
                const user = await users.findOne({ email: token.user.email })
                session.user = user
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true,
    },
})
