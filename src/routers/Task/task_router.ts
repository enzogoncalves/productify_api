import { FastifyTypedInstance } from "../../utils/types";
import z from 'zod'
import { taskController } from "./task_controller";

const createTaskSchema = z.object({
	title: z.string(),
	text: z.string(),
	priority: z.enum(['low', 'medium', 'high'])
})

export type createTaskInput = z.infer<typeof createTaskSchema>

const updateTaskSchema = z.object({
	title: z.string(),
	text: z.string(),
	priority: z.enum(['low', 'medium', 'high'])
})

export type updateTaskInput = z.infer<typeof updateTaskSchema>

export async function taskRouter(app: FastifyTypedInstance) {
	app.post('/', {
		schema: {
			description: 'Create task',
			tags: ['task'],
			body: createTaskSchema
		}
	}, taskController.create)

	app.put('/', {
		schema: {
			description: 'Create task',
			tags: ['task'],
			body: createTaskSchema
		}
	}, taskController.create)


}