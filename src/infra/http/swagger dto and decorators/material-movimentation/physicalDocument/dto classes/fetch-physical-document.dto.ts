import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
export class FetchPhysicalDocumentsQueryDto {
  @ApiProperty({
    example: "1",
    description: "Page number for pagination",
    required: false,
    default: 1,
    minimum: 1,
  })
  page!: number;
  @ApiProperty({
    example: "project-id",
    description: "project's id of the identifier",
    required: false,
  })
  projectId!: string;
  @ApiProperty({
    example: 3,
    description: "ID or identifier to be found",
    required: false,
  })
  identifier!: number;
}
