import { IsDateString, IsEmail, IsIn, IsOptional, isPhoneNumber, IsPhoneNumber, IsString } from 'class-validator';

export class PatchCoachDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsIn(['Male', 'Female'])
  gender?: 'Male' | 'Female';
}

export class PostCoachDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsDateString()
  birthDate: string;

  @IsIn(['Male', 'Female'])
  gender: 'Male' | 'Female';

  @IsString()
  phoneNumber: string;
}

export class PostAdminDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
