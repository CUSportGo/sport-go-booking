import { Test, TestingModule } from '@nestjs/testing';
import { BookingRepository } from '../repository/booking.repository';
import { SportareaService } from '../sportarea/sportarea.service';
import { UserService } from '../user/user.service';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  const mockBookingRepo = {};
  const mockSportAreaService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: BookingRepository,
          useValue: mockBookingRepo,
        },
        {
          provide: SportareaService,
          useValue: mockSportAreaService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
