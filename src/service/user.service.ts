import { CreateUserPayload } from "../interface/user.interface"
import { prismaClient } from "../lib/db"
import bcryptServiceObj from "./bcrypt.service"

export class UserService {
    async createUser(payload: CreateUserPayload) {
        const {firstName, lastName, email, password}  = payload
        const hashedPassword =  await bcryptServiceObj.hash(password)
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        })
    }   

}
