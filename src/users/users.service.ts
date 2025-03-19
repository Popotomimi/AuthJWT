import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';

import * as bcrypt from 'bcrypt'; // Corrigido para usar `* as` para compatibilidade

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  // Registro de Usuário
  async register(createUserDto: CreateUserDto): Promise<void> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    try {
      const newUser = new this.userModel({
        email: createUserDto.email,
        name: createUserDto.name,
        passwordHash: passwordHash, // Corrigido para usar o nome correto
      });

      await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // Erro de chave única (email duplicado)
        throw new ConflictException('Email já está em uso.');
      }
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  // Login de Usuário (placeholder para implementação futura)
  async login(createUserDto: CreateUserDto): Promise<void> {
    console.log('Teste no método login:', createUserDto);
  }

  // Atualização de Usuário
  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    console.log(`Teste no método update. ID: ${id}`, updateUserDto);
  }

  // Remoção de Usuário
  async remove(id: string): Promise<void> {
    console.log(`Teste no método remove. ID: ${id}`);
  }
}
