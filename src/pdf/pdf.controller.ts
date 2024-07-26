import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf-dto.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';

@ApiTags('PdfGenrator')
@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  @UseGuards(ApiKeyGuard)
  async generatePdf(
    @Body() createPdfDto: CreatePdfDto,
    @Req() req,
  ): Promise<{ downloadLink: string }> {
    const { templatePath, data } = createPdfDto;
    const pdfFileName = await this.pdfService.generatePdf(templatePath, data);
    const downloadLink = `${req.protocol}://${req.get('host')}/pdf-gen/${pdfFileName}`;
    return { downloadLink };
  }
}
