import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {

  constructor(@InjectRepository(Cat) private readonly catRepository: Repository<Cat>,
    @InjectRepository(Breed) private readonly breedReposirory: Repository<Breed>
  ) { }

  async create(createCatDto: CreateCatDto) {
    const breed = await this.breedReposirory.findOneBy({
      name: createCatDto.breed,
    });
    if (!breed) throw new BadRequestException('breed not found');

    return await this.catRepository.save({
      ...createCatDto,
      breed
    });
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findOne(id: number) {
    return await this.catRepository.findOneBy({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    // return await this.catRepository.update(id, updateCatDto);
    return;
  }

  //el softDelete o el softRemove se utiliza para hacer una eliminacion logica, el elemento ya no se muestra pero en la base de datos sigue estando con la fecha de cuando fue eliminado.
  async remove(id: number) {
    return await this.catRepository.softDelete({ id });// se le pasa el id
    // return await this.catRepository.softRemove({ id });// se le pasa la instancia del objeto a eliminar
  }
}
