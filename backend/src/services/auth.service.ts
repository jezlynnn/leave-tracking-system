import { UserRepository } from '../repositories/user.repository';
import { AuditLogRepository } from '../repositories/auditLog.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError } from '../middleware/errorHandler';
import { PublicUser } from '../types';

const userRepo = new UserRepository();
const auditRepo = new AuditLogRepository();

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export class AuthService {
  async login(input: LoginInput, ipAddress?: string): Promise<PublicUser> {
    const user = await userRepo.findByEmail(input.email);

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(403, 'Account is deactivated');
    }

    const passwordValid = await comparePassword(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    await userRepo.updateLastLogin(user.id);

    await auditRepo.create({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress,
    });

    const { passwordHash: _ph, ...publicUser } = user;
    return publicUser;
  }

  async register(input: RegisterInput): Promise<PublicUser> {
    const exists = await userRepo.existsByEmail(input.email);
    if (exists) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await userRepo.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role ?? 'employee',
    });

    await auditRepo.create({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: user.id,
      newValues: { email: user.email, role: user.role },
    });

    return user;
  }

  async logout(userId: string, ipAddress?: string): Promise<void> {
    await auditRepo.create({
      userId,
      action: 'USER_LOGOUT',
      entityType: 'user',
      entityId: userId,
      ipAddress,
    });
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }
}
