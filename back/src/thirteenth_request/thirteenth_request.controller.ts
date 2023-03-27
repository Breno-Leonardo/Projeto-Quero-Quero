import {
  Controller,
  Get,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Headers,
  Param,
} from '@nestjs/common';
import { CollaboratorType } from 'src/collaborator/enum/collaborator-type';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateThirteenthRequestDto } from './dto/thirteenth_request.dto';
import { ThirteenthRequestService } from './thirteenth_request.service';
@Controller('decimo-terceiro')
export class ThirteenthRequestController {
  constructor(
    private readonly thirteenthRequestService: ThirteenthRequestService,
  ) {}

  @Roles([
    CollaboratorType.CollaboratorManager,
    CollaboratorType.Rh,
    CollaboratorType.Manager,
    CollaboratorType.Collaborator,
  ])
  @Get('lista-solicitacoes')
  async getAllRequest() {
    return this.thirteenthRequestService.getAllRequests();
  }

  @Roles([
    CollaboratorType.CollaboratorManager,
    CollaboratorType.Rh,
    CollaboratorType.Manager,
    CollaboratorType.Collaborator,
  ])
  @Get('lista-solicitacoes/:matricula')
  async getAllRequestsByRegistration(@Param('matricula') matricula) {
    return this.thirteenthRequestService.getAllRequestsByRegistration(
      matricula,
    );
  }

  @Roles([
    CollaboratorType.CollaboratorManager,
    CollaboratorType.Manager,
    CollaboratorType.Collaborator,
  ])
  @UsePipes(ValidationPipe)
  @Post('nova-solicitacao')
  async createRequest(
    @Body() createThirteenthRequest: CreateThirteenthRequestDto,
    @Headers() headers,
  ) {
    //values to check if registration  in the token is the same as in the body of the request
    const bodyValues = new Map(Object.entries(createThirteenthRequest));
    return this.thirteenthRequestService.createThirteenthRequest(
      createThirteenthRequest,
      headers.authorization,
      bodyValues.get('colaborador'),
    );
  }
}
