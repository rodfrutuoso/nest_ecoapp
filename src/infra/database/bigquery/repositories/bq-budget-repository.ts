import { Injectable } from "@nestjs/common";
import { BudgetRepository } from "src/domain/material-movimentation/application/repositories/budget-repository";
import { Budget } from "src/domain/material-movimentation/enterprise/entities/budget";
import { BigQueryService } from "../bigquery.service";
import { BqBudgetMapper } from "../mappers/bq-budget-mapper";
import { BudgetWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/budget-with-details";
import { BqBudgetWithDetailsMapper } from "../mappers/bq-budget-with-details-mapper";

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

  async findByProjectWithDetails(
    projectId: string,
    baseId: string
  ): Promise<BudgetWithDetails[]> {
    const [base] = await this.bigquery.base.select({ where: { id: baseId } });

    const budgets = await this.bigquery.budget.select({
      where: { projectId, contractId: base.contractId },
      include: {
        project: {
          join: {
            table: "project",
            on: "budget.projectId = project.id",
          },
          relationType: "one-to-one",
        },
        contract: {
          join: {
            table: "contract",
            on: "budget.contractId = contract.id",
          },
          relationType: "one-to-one",
        },
        user: {
          join: {
            table: "users",
            on: "budget.userId = users.id",
          },
          relationType: "one-to-one",
        },
        material: {
          join: {
            table: "materials",
            on: "budget.materialId = materials.id",
          },
          relationType: "one-to-one",
        },
      },
    });

    const budgetsMapped = budgets.map(BqBudgetWithDetailsMapper.toDomin);

    return budgetsMapped;
  }

  async create(budget: Budget): Promise<void> {
    const data = BqBudgetMapper.toBigquery(budget);

    await this.bigquery.budget.create([data]);
  }
}
