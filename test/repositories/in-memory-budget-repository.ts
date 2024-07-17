import { BudgetRepository } from "../../src/domain/material-movimentation/application/repositories/budget-repository";
import { Budget } from "../../src/domain/material-movimentation/enterprise/entities/budget";

export class InMemoryBudgetRepository implements BudgetRepository {
  public items: Budget[] = [];

  async findByProject(projectid: string): Promise<Budget[]> {
    const budgets = this.items.filter(
      (budget) => budget.projectId.toString() === projectid
    );

    return budgets;
  }

  async create(budget: Budget) {
    this.items.push(budget);
  }
}
