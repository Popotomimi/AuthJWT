import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @MaxLength(15, { message: 'A senha deve ter no máximo 15 caracteres' })
  @Matches(/[A-Za-z\d@$!%*?&]/, {
    message:
      'A senha deve conter pelo menos uma letra, um número ou um caractere especial',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;
}
