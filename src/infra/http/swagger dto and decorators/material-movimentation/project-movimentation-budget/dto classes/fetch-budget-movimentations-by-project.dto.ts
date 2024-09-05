import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
export class FetchBudgetMovimentationByProjectQueryDto {
  @ApiProperty({
    example: "B-1234567",
    description: "project identification number",
  })
  project_number!: string;
}
