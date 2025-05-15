import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      dropSchema: true,
      synchronize: true,
      autoLoadEntities: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
