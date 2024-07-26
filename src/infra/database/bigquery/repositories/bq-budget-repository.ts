import { Injectable } from "@nestjs/common";
import { BudgetRepository } from "src/domain/material-movimentation/application/repositories/budget-repository";
import { Budget } from "src/domain/material-movimentation/enterprise/entities/budget";
import { BigQueryService } from "../bigquery.service";
import { BqBudgetMapper } from "../mappers/bq-budget-mapper";

@Injectable()
export class BqBudgetRepository implements BudgetRepository {
  constructor(private bigquery: BigQueryService) {}

  async findByProject(projectId: string): Promise<Budget[]> {
    const budgets = await this.bigquery.budget.select({
      where: { projectId },
    });

    const budgetsMapped = budgets.map(BqBudgetMapper.toDomin);

    return budgetsMapped;
  }
  async create(budget: Budget): Promise<void> {
    const data = BqBudgetMapper.toBigquery(budget);

    await this.bigquery.budget.create([data]);
  }
}
