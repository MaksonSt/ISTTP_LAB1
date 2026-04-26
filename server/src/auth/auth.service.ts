import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, userRole: role = role.USER) {
    const existing = await this.prisma.users.findUnique({ where: { email } });
    if (existing) throw new UnauthorizedException('User already exists');

    const user = await this.prisma.users.create({
      data: { email, password, role: userRole },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token: this.jwt.sign({ id: user.id, email: user.email, role: user.role }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token: this.jwt.sign({ id: user.id, email: user.email, role: user.role }),
    };
  }

  async validateUser(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }
}
