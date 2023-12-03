import { InjectRepository } from '@nestjs/typeorm';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BreedsService {

  constructor(@InjectRepository(Breed) private readonly breedReposirory: Repository<Breed>) { };


  async create(createBreedDto: CreateBreedDto) {
    return await this.breedReposirory.save(createBreedDto);
  }

  async findAll() {
    return await this.breedReposirory.find({ relations: ['cats'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} breed`;
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    return await this.breedReposirory.update(id, updateBreedDto);
  }

  remove(id: number) {
    return `This action removes a #${id} breed`;
  }
}
