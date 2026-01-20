import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { IsStrongPassword } from '../../../shared/validators/password.validator';

export enum Level {
  ELEMENTARY = 'elementary',
  MIDDLE_SCHOOL = 'middle_school',
  JUNIOR_HIGH = 'junior_high',
  HIGH_SCHOOL = 'high_school',
}

export enum AccountType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password!: string;

  @IsEnum(Level, { message: 'Level must be one of: elementary, middle_school, junior_high, high_school' })
  @IsNotEmpty({ message: 'Educational level is required' })
  level!: Level;

  @IsOptional()
  @IsInt({ message: 'Grade must be an integer' })
  @Min(1, { message: 'Grade must be at least 1' })
  @Max(12, { message: 'Grade must be at most 12' })
  grade?: number;

  @IsOptional()
  @IsEnum(AccountType, { message: 'Account type must be one of: student, teacher, admin' })
  account_type?: AccountType;
}
