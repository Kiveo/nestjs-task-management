import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthCredentailsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password needs each: uppercase, lowercase, and number'
  })
  password: string;
}
