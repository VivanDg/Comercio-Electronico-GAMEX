import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError } from '../../common/errors/AppError';
import { logOperation } from '../../common/services/operationLog.service';
import { authRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.dto';
import { notificationsService } from '../notifications/notifications.service';

const SALT_ROUNDS = 12;

export class AuthService {
  private generateToken(userId: number, email: string, rol: string): string {
    return jwt.sign({ userId, email, rol }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  async register(dto: RegisterDto) {
    const existing = await authRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await authRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      password: hashedPassword,
    });

    await logOperation({
      action: 'REGISTER',
      entity: 'User',
      entityId: user.id,
      userId: user.id,
      details: { email: user.email },
    });

    notificationsService.sendWelcomeEmail(user.email, user.nombre).catch(() => {});

    const token = this.generateToken(user.id, user.email, user.rol);

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await authRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    await logOperation({
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      userId: user.id,
    });

    const token = this.generateToken(user.id, user.email, user.rol);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: number) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Usuario no encontrado');
    }
    return user;
  }
}

export const authService = new AuthService();
