import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { API_V1_PATH } from '~common/http/http.constant';
import {
  GOLD_PRICE_REPOSITORY,
  IGoldPriceRepository,
} from '~modules/gold-price/gold-price.repository';
import { GoldPriceResDto } from './dto/gold-price.res.dto';
import { CreateGoldPriceNoteUseCase } from '~modules/gold-price/submodules/gold-price-note/use-cases/create-gold-price-note.use-case';
import { GoldPriceNoteResDto } from '~data-api/gold-price-note/dto/gold-price-note.res.dto';
import { CreateGoldPriceNoteBodyDto } from '~data-api/gold-price-note/dto/create-gold-price-note.body.dto';
import { JwtGuard } from '~data-api/auth/guards/jwt.guard';
import { AuthAsyncCtx } from '~modules/auth/auth-async-ctx';

@ApiBearerAuth()
@ApiTags('gold-prices')
@UseGuards(JwtGuard)
@Controller(`${API_V1_PATH}/gold-prices`)
export class GoldPriceController {
  constructor(
    @Inject(GOLD_PRICE_REPOSITORY)
    private goldPriceRepository: IGoldPriceRepository,
    private createGoldPriceNoteUseCase: CreateGoldPriceNoteUseCase,
    private authCtx: AuthAsyncCtx,
  ) {}

  @Get('/')
  async getAll() {
    const gps = await this.goldPriceRepository.getMany();

    return gps.map((gp) => new GoldPriceResDto(gp));
  }

  @HttpCode(200)
  @Post('/:id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() body: CreateGoldPriceNoteBodyDto,
  ) {
    const gp = await this.goldPriceRepository.getById(id);

    if (!gp) {
      throw new NotFoundException('Gold price not found');
    }

    const note = await this.createGoldPriceNoteUseCase.execute(gp, {
      ...body,
      userId: this.authCtx.currentUser.unwrap().id,
    });

    return new GoldPriceNoteResDto(note);
  }
}
