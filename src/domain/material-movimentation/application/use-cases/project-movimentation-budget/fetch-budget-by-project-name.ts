import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { BudgetRepository } from "../../repositories/budget-repository";
import { ProjectRepository } from "../../repositories/project-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { BudgetWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/budget-with-details";

interface FetchBudgetByProjectNameUseCaseRequest {
  project_number: string;
}

type FetchBudgetByProjectNameUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    budgets: BudgetWithDetails[];
  }
>;

@Injectable()
export class FetchBudgetByProjectNameUseCase {
  constructor(
    private budgetRepository: BudgetRepository,
    private projectRepository: ProjectRepository
  ) {}

  async execute({
    project_number,
  }: FetchBudgetByProjectNameUseCaseRequest): Promise<FetchBudgetByProjectNameUseCaseResponse> {
    const project = await this.projectRepository.findByProjectNumber(
      project_number
    );

    if (!project) return left(new ResourceNotFoundError());

    const budgets = await this.budgetRepository.findByProjectWithDetails(
      project.id.toString()
    );

    if (!budgets.length) return left(new ResourceNotFoundError());

    return right({ budgets });
  }
}
