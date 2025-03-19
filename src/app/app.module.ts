import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from '../db/db'; // Caminho para o arquivo ajustado

@Module({
  imports: [
    DatabaseModule, // Registra a conexão com o banco
    UsersModule, // Registra o módulo Users
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
