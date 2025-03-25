import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
  IsString,
  Matches,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória' })
  @MaxLength(100, { message: 'A rua deve ter no máximo 100 caracteres' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @MaxLength(100, { message: 'A cidade deve ter no máximo 100 caracteres' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @MaxLength(100, { message: 'O estado deve ter no máximo 100 caracteres' })
  state: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, {
    message: 'O código postal deve ter no máximo 20 caracteres',
  })
  postalCode?: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'A senha deve ter no máximo 100 caracteres' })
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

  @IsString()
  @IsOptional()
  @MaxLength(10, { message: 'O campo gênero deve ter no máximo 10 caracteres' })
  gender?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsString()
  @IsOptional()
  @MaxLength(20, {
    message: 'O número de telefone deve ter no máximo 20 caracteres',
  })
  phone?: string;
}
