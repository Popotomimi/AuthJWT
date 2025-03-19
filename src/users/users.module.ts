import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Registra o modelo User
  ],
  controllers: [UsersController],
  providers: [UsersService], // Serviço para as operações com usuários
  exports: [UsersService], // Exporta o serviço para ser usado em outros módulos
})
export class UsersModule {}
