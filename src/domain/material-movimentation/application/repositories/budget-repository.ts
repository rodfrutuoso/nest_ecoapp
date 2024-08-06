import { Budget } from "../../enterprise/entities/budget";

export abstract class BudgetRepository {
  abstract findByProject(projectid: string): Promise<Budget[]>;
  abstract create(budget: Budget): Promise<void>;
}
