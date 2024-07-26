import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async generateApiKey(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const apiKey = crypto.randomBytes(20).toString('hex'); // Generate a random API key
    const salt = await bcrypt.genSalt();
    const hashedApiKey = await bcrypt.hash(apiKey, salt);

    let user = await this.usersRepository.findOne({ where: { email } });

    if (user) {
      user.apiKey = hashedApiKey;
      user.firstName = firstName;
      user.lastName = lastName;
    } else {
      user = this.usersRepository.create({
        email,
        firstName,
        lastName,
        apiKey: hashedApiKey,
      });
    }

    await this.usersRepository.save(user);
    return apiKey; // Return the plain API key
  }

  async validateApiKey(providedApiKey: string): Promise<boolean> {
    const users = await this.usersRepository.find();

    for (const user of users) {
      const isMatch = await bcrypt.compare(providedApiKey, user.apiKey);
      if (isMatch) {
        return true;
      }
    }

    return false;
  }
}
