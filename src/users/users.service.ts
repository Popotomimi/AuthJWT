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

import * as bcrypt from 'bcrypt';

const createUserToken = require('../auth/create-user-token');

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  // Resgata todos os usuários
  async findAll() {
    const users = this.userModel.find().select('-password');

    return users;
  }

  // Busca um usuário pelo ID, excluindo a senha
  async findUserById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  // Registro de Usuário
  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    if (
      !createUserDto.email ||
      !createUserDto.name ||
      !createUserDto.password
    ) {
      throw new NotFoundException('Preencha todos os campos');
    }

    // Criptografia de senha
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    try {
      const newUser = new this.userModel({
        email: createUserDto.email,
        name: createUserDto.name,
        password: passwordHash,
      });

      await newUser.save();

      return { message: 'Usuário Registrado com sucesso!' };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email já está em uso.');
      }
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  // Login
  async login(createUserDto: CreateUserDto): Promise<any> {
    if (!createUserDto.email || !createUserDto.password) {
      throw new NotFoundException('Preencha todos os campos');
    }

    // Verificando se o usuário esta cadastrado no sistema
    const user = await this.userModel.findOne({ email: createUserDto.email });

    if (!user) {
      throw new UnauthorizedException('Usuário não cadastrado!');
    }

    // Verificando senha
    const checkPassword = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('Senha inválida');
    }

    const userData = await createUserToken(user);

    return {
      message: userData.message,
      token: userData.token,
      id: userData.id,
    };
  }

  // Atualização de Usuário
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    // Verifica se a senha está presente no objeto updateUserDto
    if (updateUserDto.password) {
      // Criptografa a nova senha
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true },
    );

    return {
      message: 'Usuário atualizado com sucesso!',
      user: updatedUser,
    };
  }

  // Remoção de Usuário
  async remove(id: string): Promise<any> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return { message: 'Usuário não encontrado!' };
    }

    await this.userModel.findByIdAndDelete(id);

    return { message: 'Usuário removido com sucesso!' };
  }
}
