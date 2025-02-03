import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { loginUserInput, loginUserUnauthorizedResponseType } from "./auth_router";
import bcrypt from 'bcrypt';
const prisma = new PrismaClient()

export const authController = {
	login: async (req: FastifyRequest<{Body: loginUserInput}>, reply: FastifyReply) => {
		const { email, password } = req.body;
		
		const user = await prisma.user.findFirst({
			where: {
				email: email
			}
		})
		
		const authorized = user && (await bcrypt.compare(password, user.password))
	
		if(!user || !authorized) {
			reply.status(401).send({message: "Invalid email or password"} as loginUserUnauthorizedResponseType)
			return;
		}

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
	},
	logout: async(req: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie('access_token')

		return reply.send({ message: 'Logout successful '})
	}
}