import { Injectable } from "@nestjs/common";
import { BudgetRepository } from "src/domain/material-movimentation/application/repositories/budget-repository";
import { Budget } from "src/domain/material-movimentation/enterprise/entities/budget";

@Injectable()
export class BqBudgetRepository implements BudgetRepository {
  findByProject(projectid: string): Promise<Budget[]> {
    throw new Error("Method not implemented.");
  }
  create(budget: Budget): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
