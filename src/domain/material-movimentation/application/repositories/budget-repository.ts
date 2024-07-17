import { Budget } from "../../enterprise/entities/budget";

export interface BudgetRepository {
  findByProject(projectid: string): Promise<Budget[]>;
  create(budget: Budget): Promise<void>;
}
