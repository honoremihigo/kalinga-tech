
import { Controller, Get, HttpException } from "@nestjs/common";
import { ClientService } from "./client.service";

@Controller('client')
export class ClientController {
    constructor( private readonly clientService: ClientService ){}

    @Get('')
    async findAll(){
        try {
            return await this.clientService.findAll()
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}
