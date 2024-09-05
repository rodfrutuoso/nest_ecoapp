import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
export class IdentifierAttributionBodyDto {
  @ApiProperty({
    example: "project-id",
    description: "project's id of the physical document",
  })
  projectId!: string;
  @ApiProperty({
    example: 3,
    description: "ID or identifier of the physical document",
  })
  identifier!: number;
}
