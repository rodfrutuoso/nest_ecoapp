import { BudgetWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/budget-with-details";
import { BudgetRepository } from "../../src/domain/material-movimentation/application/repositories/budget-repository";
import { Budget } from "../../src/domain/material-movimentation/enterprise/entities/budget";
import { InMemoryContractRepository } from "./in-memory-contract-repository";
import { InMemoryMaterialRepository } from "./in-memory-material-repository";
import { InMemoryProjectRepository } from "./in-memory-project-repository";
import { InMemoryEstimatorRepository } from "./in-memory-estimator-repository";
import { InMemoryBaseRepository } from "./in-memory-base-repository";

export class InMemoryBudgetRepository implements BudgetRepository {
  public items: Budget[] = [];

  constructor(
    private estimatorRepository: InMemoryEstimatorRepository,
    private materialRepository: InMemoryMaterialRepository,
    private projectRepository: InMemoryProjectRepository,
    private contractRepository: InMemoryContractRepository,
    private baseRepository: InMemoryBaseRepository
  ) {}

  async findByProject(projectid: string): Promise<Budget[]> {
    const budgets = this.items.filter(
      (budget) => budget.projectId.toString() === projectid
    );

    return budgets;
  }

  async findByProjectWithDetails(
    projectid: string,
    baseId: string
  ): Promise<BudgetWithDetails[]> {
    const baseForContract = this.baseRepository.items.find(
      (base) => base.id.toString() === baseId
    );

    const budgets = this.items
      .filter(
        (budget) =>
          budget.projectId.toString() === projectid &&
          budget.contractId === baseForContract!.contractId
      )
      .map((budget) => {
        const estimator = this.estimatorRepository.items.find(
          (estimator) => estimator.id === budget.estimatorId
        );
        if (!estimator) {
          throw new Error(`estimator ${budget.estimatorId} does not exist.`);
        }
        const project = this.projectRepository.items.find(
          (project) => project.id === budget.projectId
        );
        if (!project) {
          throw new Error(`project ${budget.projectId} does not exist.`);
        }
        const contract = this.contractRepository.items.find(
          (contract) => contract.id === budget.contractId
        );
        if (!contract) {
          throw new Error(`contract ${budget.contractId} does not exist.`);
        }
        const material = this.materialRepository.items.find(
          (material) => material.id === budget.materialId
        );
        if (!material) {
          throw new Error(`material ${budget.materialId} does not exist.`);
        }

        return BudgetWithDetails.create({
          budgetId: budget.id,
          value: budget.value,
          createdAt: budget.createdAt,
          estimator,
          material,
          project,
          contract,
        });
      });

    return budgets;
  }

  async create(budgets: Budget[]) {
    budgets.map((budget) => this.items.push(budget));
  }
}
