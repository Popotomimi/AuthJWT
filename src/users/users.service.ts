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

  // Pesquisa usuário pelo email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  // Registro de Usuário
  async register(createUserDto: CreateUserDto): Promise<any> {
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

      const userData = await createUserToken(newUser);

      return {
        message: `Bem vindo ${createUserDto.name}`,
        token: userData.token,
        id: userData.id,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email já está em uso.');
      }
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  async googleRegister(googleUserDto: {
    email: string;
    name: string;
  }): Promise<any> {
    if (!googleUserDto.email || !googleUserDto.name) {
      throw new NotFoundException('Preencha todos os campos');
    }

    try {
      const newUser = new this.userModel({
        email: googleUserDto.email,
        name: googleUserDto.name,
        authProvider: 'google',
      });

      await newUser.save();

      const userData = await createUserToken(newUser);

      // 🔍 Buscar o usuário completo no banco com lean()
      const userFromDb = await this.userModel
        .findById(userData.id)
        .select('_id name email')
        .lean();

      // 🧪 Log para depuração
      console.log('Usuário do banco:', userFromDb);

      // ✅ Verificação de dados essenciais
      if (!userFromDb || !userFromDb.name || !userFromDb.email) {
        throw new Error('Dados do usuário incompletos após registro.');
      }

      return {
        message: `Bem vindo ${userFromDb.name}`,
        token: userData.token,
        user: {
          id: userFromDb._id,
          name: userFromDb.name,
          email: userFromDb.email,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email já está em uso.');
      }
      throw new Error(`Erro ao registrar usuário via Google: ${error.message}`);
    }
  }

  // Login
  async login(createUserDto: CreateUserDto): Promise<any> {
    if (!createUserDto.email || !createUserDto.password) {
      throw new NotFoundException('Preencha todos os campos');
    }

    // Verificando se o usuário está cadastrado no sistema
    const user = await this.userModel.findOne({ email: createUserDto.email });

    if (!user) {
      throw new UnauthorizedException('Usuário não cadastrado!');
    }

    if (user.authProvider === 'google') {
      throw new UnauthorizedException('Este usuário deve logar com o Google');
    }

    // Verificando senha
    const checkPassword = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new UnauthorizedException('Senha inválida');
    }

    // Cria o token e retorna os dados necessários
    const userData = await createUserToken(user);

    return {
      message: userData.message,
      token: userData.token,
      id: userData.id,
      name: user.name,
    };
  }

  // Pesquisa usuário pelo id
  async findUserById(id: string): Promise<any> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }
    return user;
  }

  // Update User
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    // Criptografa a senha, se houver
    if (updateUserDto.password) {
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
