import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { BudgetRepository } from "../../repositories/budget-repository";
import { ProjectRepository } from "../../repositories/project-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchOnlyProjectsOfBudgetsUseCaseRequest {
  project_numbers: string[];
  contractId: string;
}

interface ProjectAndId {
  id: string;
  project_number: string;
}

type FetchOnlyProjectsOfBudgetsUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    foundProjects: ProjectAndId[];
  }
>;

@Injectable()
export class FetchOnlyProjectsOfBudgetsUseCase {
  constructor(
    private budgetRepository: BudgetRepository,
    private projectRepository: ProjectRepository
  ) {}

  async execute({
    project_numbers,
    contractId,
  }: FetchOnlyProjectsOfBudgetsUseCaseRequest): Promise<FetchOnlyProjectsOfBudgetsUseCaseResponse> {
    const projects =
      await this.projectRepository.findByProjectNumberAndContractIds(
        project_numbers,
        contractId
      );

    if (projects.length === 0)
      return left(
        new ResourceNotFoundError(
          "Nenhum dos projetos informados está cadastrado"
        )
      );

    const projectIds = projects.map((project) => project.id.toString());

    const budgets = await this.budgetRepository.findByProjectIds(
      projectIds,
      contractId
    );

    if (!budgets.length)
      return left(new ResourceNotFoundError("Nenhum orçamento não encontrado"));

    const foundProjects = budgets.map((budget) => {
      return {
        id: budget.projectId.toString(),
        project_number: projects.find(
          (project) => project.id === budget.projectId
        )!.project_number,
      };
    });

    return right({ foundProjects });
  }
}
