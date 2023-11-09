import { Test, TestingModule } from '@nestjs/testing';
import { SportareaService } from './sportarea.service';

describe('SportareaService', () => {
  let service: SportareaService;

  const mockClient = {
    getService: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportareaService,
        {
          provide: 'SPORTAREA_PACKAGE',
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get<SportareaService>(SportareaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
