import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { BreedsModule } from './breeds/breeds.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'nest-crud-mysql',
    autoLoadEntities: true, // Para que cree automaticamente las entidades en la base de datos, sin tener que pasarle manualmente las entidades que tiene que crear. Esto viene a remplazar la opcion entiti: [].
    synchronize: true,
  }), CatsModule, BreedsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
