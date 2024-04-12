import { Test, TestingModule } from '@nestjs/testing';
import { GetUserUseCase } from './get-user.use-case';
import { USER_REPOSITORY } from '../user.repository';
import { UserRepositoryMock } from '../user.repository.mock';

describe('GetUserUseCase', () => {
  let service: GetUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        { provide: USER_REPOSITORY, useClass: UserRepositoryMock },
      ],
    }).compile();

    service = module.get(GetUserUseCase);
  });

  it('should not get user when getting by userName', async () => {
    const result = await service.byUsername('test');

    expect(result).toBeNull();
  });
});
