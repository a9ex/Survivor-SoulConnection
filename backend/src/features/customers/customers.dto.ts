import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  isPhoneNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class PatchCustomerDTO {
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
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsIn(['Male', 'Female'])
  gender?: 'Male' | 'Female';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn([
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ])
  astrologicalSign?: string;

  @IsOptional()
  @IsNumber()
  coachId?: number;
}

export class PostCustomerDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsDateString()
  birthDate: string;

  @IsIn(['Male', 'Female'])
  gender: 'Male' | 'Female';

  @IsString()
  description: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsIn([
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ])
  astrologicalSign: string;

  @IsOptional()
  @IsNumber()
  coachId?: number;
}
