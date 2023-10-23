import { Test, TestingModule } from '@nestjs/testing';
import { SportareaController } from './sportarea.controller';

describe('SportareaController', () => {
  let controller: SportareaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportareaController],
    }).compile();

    controller = module.get<SportareaController>(SportareaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
