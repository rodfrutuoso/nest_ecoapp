import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { BudgetRepository } from "../../repositories/budget-repository";
import { MovimentationRepository } from "../../repositories/movimentation-repository";
import { ProjectRepository } from "../../repositories/project-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { MovimentationWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/movimentation-with-details";
import { BudgetWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/budget-with-details";

interface FetchBudgetMovimentationByProjectUseCaseRequest {
  project_number: string;
  baseId: string;
}

type FetchBudgetMovimentationByProjectUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    movimentations: MovimentationWithDetails[];
    budgets: BudgetWithDetails[];
  }
>;

@Injectable()
export class FetchBudgetMovimentationByProjectUseCase {
  constructor(
    private movimentationRepository: MovimentationRepository,
    private projectRepository: ProjectRepository,
    private budgetRepository: BudgetRepository
  ) {}

  async execute({
    project_number,
    baseId,
  }: FetchBudgetMovimentationByProjectUseCaseRequest): Promise<FetchBudgetMovimentationByProjectUseCaseResponse> {
    const project = await this.projectRepository.findByProjectNumber(
      project_number,
      baseId
    );

    if (!project)
      return left(new ResourceNotFoundError("Projeto não encontrado"));

    const movimentations =
      await this.movimentationRepository.findByProjectWithDetails(
        project.id.toString(),
        baseId
      );

    const budgets = await this.budgetRepository.findByProjectWithDetails(
      project.id.toString(),
      baseId
    );

    return right({ movimentations, budgets });
  }
}
