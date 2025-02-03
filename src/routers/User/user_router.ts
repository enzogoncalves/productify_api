import { FastifyTypedInstance } from "../../utils/types";

export async function userRouter(app: FastifyTypedInstance) {
	app.get('/', (req, reply) => {
		reply.send('Hello World')
	})
}