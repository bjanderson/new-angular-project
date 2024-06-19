import { ICSVModel } from '@bjanderson/my-project-shared';
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AbstractCRUDService } from './abstract-crud-service';

export class AbstractCRUDController<T extends ICSVModel> {
  constructor(protected accountProviderService: AbstractCRUDService<T>) {}

  @Post()
  create(@Body() values: T[]): Promise<T[]> {
    return this.accountProviderService.create(values);
  }

  @Get()
  findAll(args?: any): Promise<T[]> {
    return this.accountProviderService.findAll(args);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<T> {
    return this.accountProviderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() value: T): Promise<T> {
    return this.accountProviderService.update(id, value);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.accountProviderService.remove(id);
  }
}
