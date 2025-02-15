import { Transform } from "class-transformer";

export class CollectionResponseDto {
  @Transform(({ value }) => value.toString())
  _id: string;

  videoUrl: string
  title: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
}

