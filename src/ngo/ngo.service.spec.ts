import { Test, TestingModule } from '@nestjs/testing';
import { NgoService } from './ngo.service';

describe('NgoService', () => {
  let service: NgoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NgoService],
    }).compile();

    service = module.get<NgoService>(NgoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
