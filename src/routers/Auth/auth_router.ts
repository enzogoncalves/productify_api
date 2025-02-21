import z from 'zod';
import { FastifyTypedInstance } from "../../utils/types";
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

const logoutUserSchema = z.object({
	authTokenId: z.string(),
	userId: z.string()
})

export type logoutUserInput = z.infer<typeof logoutUserSchema>

export async function authRouter(app: FastifyTypedInstance) {
	app.post('/signin', {
		schema: {
			tags: ['auth'],
			description: 'Login a user',
			body: loginUserSchema,
			response: {
				200: z.object({
					authorized: z.boolean(),
				}),
				401: loginUserUnauthorizedResponseSchema
			},
		}
	}, authController.signin)

	app.delete('/signout', {
		preHandler: [app.authenticate],
		schema: {
			tags: ['auth'],
			body: logoutUserSchema,
			response: {
				200: z.object({
					message: z.string()
				})
			}
		}
	}, authController.signout)
}