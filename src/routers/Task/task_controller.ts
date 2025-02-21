import { FastifyReply, FastifyRequest } from "fastify";
import { createTaskInput } from "./task_router";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const taskController = {
	create: async (req: FastifyRequest<{Body: createTaskInput}>, reply: FastifyReply) => {
		const { title, text, priority } = req.body
		const { user_id } = req.headers

		await prisma.task.create({
			data: {
				title,
				text,
				priority,
				completed: false,
				createdAt: new Date(),
				User: {
					connect: {
						uid: user_id as string
					}
				},
			},
			include: {
				User: true
			}
		})
		.then((data) => {
			return reply.status(200).send(data)
		})	
		.catch((e) => {
			return reply.status(500).send('Something went wrong')
		})
	},

	update: async (req: FastifyRequest<{Body: createTaskInput}>, reply: FastifyReply) => {
		const { title, text, priority, task_id } = req.body
		const { user_id } = req.headers

		await prisma.task.update({
			where: {
				id: task_id
			},
			data: {
				title,
				text,
				priority,
				completed: false,
				createdAt: new Date(),
				User: {
					connect: {
						uid: user_id as string
					}
				},
			}
		})
		.then((data) => {
			return reply.status(200).send(data)
		})	
		.catch((e) => {
			return reply.status(500).send('Something went wrong')
		})
	},

	delete: async (req: FastifyRequest, reply: FastifyReply) => {

	}
}