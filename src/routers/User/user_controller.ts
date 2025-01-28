import { Request, Response } from "express";

import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const userController = {
	signIn: async (req: Request, res: Response) => {
		const { email, password } = req.body;

		console.log(email)
		console.log(password)
	
	
		const user = await prisma.user.findFirst({
			where: {
				email: email
			},
			select: {
				password: true
			}
		})
	
		console.log(user)
	
		if	(user === null) {
			res.json({"response": "account not found"})
			return;
		}
	
		const isPasswordCorrect = await bcrypt.compare(password, user.password)
	
		if(isPasswordCorrect) {
			res.json({"response": "correct password"})
		} else {
			res.json({"response": "incorrect password"})
		}
	},
	create: async (req: Request, res: Response) => {
		const {  name, email, age, profile_picture, password } = req.body
	
		const passwordSalt = await bcrypt.genSalt()
		const hashedPassword = await bcrypt.hash(password, passwordSalt)
	
		const result = await prisma.user.create({
			data: {
				name,
				age,
				email,
				profile_picture,
				password: hashedPassword,
			}
		})
	
		res.json(result)
	}
}