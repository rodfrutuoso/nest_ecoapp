import { Budget } from "../../enterprise/entities/budget";
import { BudgetWithDetails } from "../../enterprise/entities/value-objects/budget-with-details";

export abstract class BudgetRepository {
  abstract findByProject(projectid: string): Promise<Budget[]>;
  abstract findByIds(budgetIds: string[]): Promise<Budget[]>;
  abstract findByProjectWithDetails(
    projectid: string,
    baseId: string
  ): Promise<BudgetWithDetails[]>;
  abstract findByProjectIds(
    projectids: string[],
    contractId: string
  ): Promise<Budget[]>;
  abstract create(budgets: Budget[]): Promise<void>;
  abstract save(budget: Budget): Promise<void>;
}
