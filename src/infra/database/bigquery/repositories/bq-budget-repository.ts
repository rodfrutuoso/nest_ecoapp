import { Injectable } from "@nestjs/common";
import { BudgetRepository } from "src/domain/material-movimentation/application/repositories/budget-repository";
import { Budget } from "src/domain/material-movimentation/enterprise/entities/budget";
import { BigQueryService } from "../bigquery.service";
import { BqBudgetMapper } from "../mappers/bq-budget-mapper";
import { BudgetWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/budget-with-details";
import { BqBudgetWithDetailsMapper } from "../mappers/budget-with-details-mapper";

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
    projectId: string
  ): Promise<BudgetWithDetails[]> {
    const budgets = await this.bigquery.budget.select({
      where: { projectId },
      include: {
        project: {
          join: {
            table: "project",
            on: "movimentation.projectId = project.id",
          },
          relationType: "one-to-one",
        },
        contract: {
          join: {
            table: "contract",
            on: "movimentation.contractId = contract.id",
          },
          relationType: "one-to-one",
        },
        user: {
          join: {
            table: "users",
            on: "movimentation.userId = users.id",
          },
          relationType: "one-to-one",
        },
        material: {
          join: {
            table: "materials",
            on: "movimentation.materialId = materials.id",
          },
          relationType: "one-to-one",
        },
      },
    })

    const budgetsMapped = budgets.map(BqBudgetWithDetailsMapper.toDomin);

    return budgetsMapped;
  }

  async create(budget: Budget): Promise<void> {
    const data = BqBudgetMapper.toBigquery(budget);

    await this.bigquery.budget.create([data]);
  }
}
