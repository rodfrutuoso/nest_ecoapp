import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user";

@Injectable()
export class BigQueryService {
  constructor(public readonly user: User) {}
}


