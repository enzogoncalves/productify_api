import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { loginUserInput, loginUserUnauthorizedResponseType, logoutUserInput } from "./auth_router";
import { addHours, addSeconds } from "date-fns";
import { SignJWT } from "jose"

import bcrypt from 'bcrypt';
const prisma = new PrismaClient()

export const authController = {
	signin: async (req: FastifyRequest<{Body: loginUserInput}>, reply: FastifyReply) => {
		const { email, password } = req.body;
		
		const user = await prisma.user.findFirst({
			where: {
				email: email
			}
		})
		
		const authorized = user && (await bcrypt.compare(password, user.password))
	
		if(!user || !authorized) {
			return reply.status(401).send({message: "Invalid email or password"} as loginUserUnauthorizedResponseType)
		}

		const date = new Date();
		const timeToExpiresTokenInHours = 1;
		const tokenExpiredDate = addHours(date, timeToExpiresTokenInHours)

		let jwt;

		try {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)
				
			const alg = 'HS256'
			
			jwt = await new SignJWT({  })
			.setProtectedHeader({ alg })
			.setIssuedAt()
			.setIssuer('urn:example:issuer')
			.setAudience('urn:example:audience')
			.setExpirationTime(tokenExpiredDate)
			.sign(secret)
		} catch(e) {
			console.log('aqui')
			console.log(e)
			reply.status(500).send('Unable to create JWT Token')
		}

		await prisma.user.update({
			where: {
				uid: user.uid
			},
			data: {
				authToken: {
					create: { token: jwt!, createdAt: date, expiresAt: tokenExpiredDate }
				}
			},
			include: {
				authToken: true
			}
		})

		const payload = {
			uid: user.uid,
			email: user.email,
			name: user.name
		}
	
		const token = req.jwt.sign(payload)

		reply.setCookie('access_token', token, {
			path: '/',
			httpOnly: true,
			secure: true
		})

		reply.status(200).send('Successfull sign in')
	},
	signout: async(req: FastifyRequest<{Body: logoutUserInput}>, reply: FastifyReply) => {
		const { authTokenId, userId } = req.body

		console.log(`authTokenId: ${authTokenId}`)
		console.log(`userId: ${userId}`)

		try {
			const user = await prisma.user.update({
				where: {
					authTokenId: authTokenId,
					uid: userId
				},
				data: {
					authToken: {
						disconnect: true
					}
				},
				include: {
					authToken: true
				}
			})

			console.log(`user: ${user}`)
		} catch(e) {
			console.log('unable to delete authTokenId in user')
			console.log(e)
			return reply.status(500).send(e)
		}

		try {
			const authToken = await prisma.authToken.delete({
				where: {
					id: authTokenId
				}
			})
		} catch(e) {
			console.log('unable to delete authToken')
			console.log(e)
			return reply.status(500).send(e)
		}

		reply.clearCookie('access_token')

		return reply.send({ message: 'Logout successful '})
	}
}