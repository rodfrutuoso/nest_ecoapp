import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user";
import { Material } from "./schemas/materials";

@Injectable()
export class BigQueryService {
  constructor(public readonly user: User, public readonly material: Material) {}
}


