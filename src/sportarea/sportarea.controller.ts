import { Controller } from '@nestjs/common';
import { SportareaService } from './sportarea.service';

@Controller('sportarea')
export class SportareaController {
  constructor(private sportareaService: SportareaService) {}
}
