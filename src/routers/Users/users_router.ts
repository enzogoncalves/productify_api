import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import z from 'zod';
import { FastifyTypedInstance } from "../../utils/types";
import { UserSchema } from "../../../prisma/generated/zod";
import { usersController } from "./users_controller";

const prisma = new PrismaClient()

const createUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	age: z.number(),
	profile_picture: z.string(),
	password: z.string()
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export async function usersRouter(app: FastifyTypedInstance) {
	app.get('/', {
		preHandler: [app.authenticate],
		schema: {
			tags: ['users'],
			description: 'List users',
			response: {200: z.array(UserSchema)}
		}
	}, async (req, reply) => {
		const users = await prisma.user.findMany({	
			select: {
				uid: true,
				name: true,
				age: true,
				email: true,
				profile_picture: true,
				password: true,
				updated_at: true,
				created_at: true
			}
		})

		reply.code(200).send(users)
	})

	app.post('/', {
		schema: {
			tags: ['users'],
			description: 'Register a new user',
			body: createUserSchema,
			response: {
				201: UserSchema
			}
		}
	},  usersController.register)
}