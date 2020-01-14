import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository', () => {
  let userRespository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRespository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRespository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up a user', () => {
      save.mockResolvedValue(undefined);
      expect(userRespository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws conflict exception already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRespository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws exception if unknown code returned', () => {
      save.mockRejectedValue({ code: '12345' }); // unhandled code
      expect(userRespository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUserPassword', () => {
    let user;
    beforeEach(() => {
      userRespository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUsername';
      user.validatePassword = jest.fn();
    });

    it('returns the username with validation success', async () => {
      userRespository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRespository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual('TestUsername');
    });

    it('returns null if unfound usser', async () => {
      userRespository.findOne.mockResolvedValue(null);
      const result = await userRespository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null if password invalid', async () => {
      userRespository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRespository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to gen a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRespository.hashPassword('testPassword', 'testSalt');
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
