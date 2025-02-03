// import { FastifyReply, FastifyRequest } from "fastify";
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient()


// export const userController = {
// 	signIn: async (req: FastifyRequest, reply: FastifyReply) => {
// 		const { email, password } = req.body;
		
		

// 		const user = await prisma.user.findFirst({
// 			where: {
// 				email: email
// 			},
// 			select: {
// 				password: true
// 			}
// 		})
	
// 		console.log(user)
	
// 		if	(user === null) {
// 			reply.status(200).send({authorized: false})
// 			return;
// 		}
	
// 		const isPasswordCorrect = await bcrypt.compare(password, user.password)
	
// 		if(isPasswordCorrect) {
// 			reply.status(200).send({authorized: true})
// 		} else {
// 			reply.status(200).send({authorized: false})
// 		}
// 	}

// 	// create: async (req: FastifyRequest, reply: FastifyReply) => {
// 	// 	const {  name, email, age, profile_picture, password } = req.body
	
// 	// 	const passwordSalt = await bcrypt.genSalt()
// 	// 	const hashedPassword = await bcrypt.hash(password, passwordSalt)
	
// 	// 	const result = await prisma.user.create({
// 	// 		data: {
// 	// 			name,
// 	// 			age,
// 	// 			email,
// 	// 			profile_picture,
// 	// 			password: hashedPassword,
// 	// 		}
// 	// 	})
	
// 	// 	reply.send(result)
// 	// }
// }