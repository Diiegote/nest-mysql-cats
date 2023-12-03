import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class CatsService {

  constructor(@InjectRepository(Cat) private readonly catRepository: Repository<Cat>,
    @InjectRepository(Breed) private readonly breedReposirory: Repository<Breed>
  ) { }

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const breed = await this.validateBreed(createCatDto.breed);

    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
  }

  async findAll(user: UserActiveInterface) {

    if (user.role === Role.ADMIN) return await this.catRepository.find();

    return await this.catRepository.find({
      where: {
        userEmail: user.email,
      }
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) throw new BadRequestException('cat not found');
    this.validateOwnerShip(cat, user);
    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterface) {
    await this.findOne(id, user);
    const breed = await this.validateBreed(updateCatDto.breed);

    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed ? breed : undefined,
      userEmail: user.email,
    });

  }

  //el softDelete o el softRemove se utiliza para hacer una eliminacion logica, el elemento ya no se muestra pero en la base de datos sigue estando con la fecha de cuando fue eliminado.
  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.catRepository.softDelete({ id });// se le pasa el id
    // return await this.catRepository.softRemove({ id });// se le pasa la instancia del objeto a eliminar
  }

  private validateOwnerShip(cat: Cat, user: UserActiveInterface) {

    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) throw new UnauthorizedException();

  }

  private async validateBreed(breed: string) {
    const breedEntity = await this.breedReposirory.findOneBy({ name: breed });

    if (!breedEntity) throw new BadRequestException('breed not found');
    return breedEntity;
  }
}
