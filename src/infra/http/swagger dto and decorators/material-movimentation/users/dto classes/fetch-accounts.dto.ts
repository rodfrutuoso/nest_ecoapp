import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
export class FetchAccountsQueryDto {
    @ApiProperty({
      example: "1",
      description: "Page number for pagination",
      required: false,
      default: 1,
      minimum: 1,
    })
    page!: number;
    @ApiProperty({
      example: "user-id",
      description: "user's id",
      required: false,
    })
    baseId!: string;
    @ApiProperty({
      example: "João da Silva",
      description: "name, or part of it, of the searched user",
      required: false,
    })
    name!: string;
  }