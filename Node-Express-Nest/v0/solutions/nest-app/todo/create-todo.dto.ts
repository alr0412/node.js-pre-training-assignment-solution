import { IsNotEmpty, IsString } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
