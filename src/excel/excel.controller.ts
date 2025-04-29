import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { Public } from 'src/common/decorator/decorator';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) { }

  @Public()
  @Post('importExcel')
  importExcel(@Body() body: { general: string, arrData: { name: string, date: string, remark: string }[] }) {
    const { general, arrData } = body;
    return this.excelService.importExcel(arrData, general);
  }
}
