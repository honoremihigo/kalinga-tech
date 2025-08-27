import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";

@Injectable()
export class ClientService{
    constructor( private readonly prisma: PrismaService ){}

    async findAll(){
        try {
            const clients = await this.prisma.client.findMany({
                include:{
                    booking:true,
                    ride:true,
                }
            })
            return clients
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}