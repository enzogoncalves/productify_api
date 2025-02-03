import { PrismaClient } from "@prisma/client";
import { FastifyTypedInstance } from "../../utils/types";
import z from 'zod';
import { authController } from "./auth_controller";

const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export type loginUserInput = z.infer<typeof loginUserSchema>

const loginUserUnauthorizedResponseSchema = z.object({
	message: z.enum(['Invalid email or password'])
})

export type loginUserUnauthorizedResponseType = z.infer<typeof loginUserUnauthorizedResponseSchema>

export async function authRouter(app: FastifyTypedInstance) {
	app.post('/login', {
		schema: {
			tags: ['auth'],
			description: 'Login a user',
			body: loginUserSchema,
			response: {
				200: z.object({
					authorized: z.boolean()
				}),
				401: loginUserUnauthorizedResponseSchema
			},
		}
	}, authController.login)

	app.delete('/logout', { preHandler: [app.authenticate]}, authController.logout)
}