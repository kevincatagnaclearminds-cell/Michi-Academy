import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthRequest } from '../../shared/guards/auth.guard';
import { ResponseHelper } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/utils/async-handler';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const loginDto: LoginDto = req.body;
    const result = await authService.login(loginDto);
    return ResponseHelper.success(res, 200, 'Login successful', result);
  });

  register = asyncHandler(async (req: Request, res: Response) => {
    const registerDto: RegisterDto = req.body;
    const result = await authService.register(registerDto);
    return ResponseHelper.success(res, 201, 'User registered successfully', result);
  });

  getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return ResponseHelper.error(res, 401, 'User not authenticated');
    }

    const user = await authService.getCurrentUser(req.user.id);
    return ResponseHelper.success(res, 200, 'User retrieved successfully', { user });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email) {
      return ResponseHelper.error(res, 400, 'Email is required');
    }

    await authService.solicitarRecuperacion(email);
    return ResponseHelper.success(
      res,
      200,
      'If the email exists, a recovery link has been sent'
    );
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return ResponseHelper.error(res, 400, 'Token and new password are required');
    }

    await authService.resetearPassword(token, newPassword);
    return ResponseHelper.success(res, 200, 'Password updated successfully');
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return ResponseHelper.error(res, 400, 'Refresh token is required');
    }

    const result = await authService.refreshToken(refreshToken);
    return ResponseHelper.success(res, 200, 'Token refreshed successfully', result);
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return ResponseHelper.error(res, 401, 'User not authenticated');
    }

    await authService.logout(req.user.id);
    return ResponseHelper.success(res, 200, 'Logged out successfully');
  });
}

export const authController = new AuthController();
