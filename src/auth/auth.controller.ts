import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorators';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {

   constructor(private readonly authService: AuthService) { }

   @Post('register')
   @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
   @ApiResponse({ status: 403, description: 'Forbidden.' })
   register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
   }

   @Post('login')
   login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
   }

   @ApiBearerAuth()
   @Get('profile')
   @Auth(Role.USER)
   profile(@ActiveUser() user: UserActiveInterface) {
      return this.authService.profile(user);
   }
}
