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

    const budgetsMapped = budgets.map(BqBudgetMapper.toDomain);

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
            table: "user",
            on: "budget.userId = user.id",
          },
          relationType: "one-to-one",
        },
        material: {
          join: {
            table: "material",
            on: "budget.materialId = material.id",
          },
          relationType: "one-to-one",
        },
      },
    });

    console.log(budgets)

    const budgetsMapped = budgets.map(BqBudgetWithDetailsMapper.toDomain);

    return budgetsMapped;
  }

  async create(budgets: Budget[]): Promise<void> {
    const data = budgets.map(BqBudgetMapper.toBigquery);

    await this.bigquery.budget.create(data);
  }

  async findByIds(ids: string[]): Promise<Budget[]> {
    const projects = await this.bigquery.budget.select({
      whereIn: { id: ids },
    });

    return projects.map(BqBudgetMapper.toDomain);
  }

  async save(budget: Budget): Promise<void> {
    await this.bigquery.budget.update({
      data: BqBudgetMapper.toBigquery(budget),
      where: { id: budget.id.toString() },
    });
  }
}
