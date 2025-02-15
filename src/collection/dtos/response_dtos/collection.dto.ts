import { Transform } from "class-transformer";
import { PlanType } from "src/schemas/user_panel/collection.schema";

export class CollectionResponseDto {
  @Transform(({ value }) => value.toString())
  _id: string;

  title: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  plan?: PlanType[];
}

