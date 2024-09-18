import { IDatabaseModel } from '@bjanderson/moneytool-shared';
import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AbstractCRUDService } from './abstract-crud-service';

export abstract class AbstractCRUDController<T extends IDatabaseModel> {
  constructor(protected service: AbstractCRUDService<T>) {}

  @Post()
  create(@Body() values: T[]): Promise<T[]> {
    return this.service.create(values);
  }

  @Get()
  findAll(args?: any): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() value: T): Promise<T> {
    return this.service.update(id, value);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<T> {
    return this.service.remove(id);
  }
}
