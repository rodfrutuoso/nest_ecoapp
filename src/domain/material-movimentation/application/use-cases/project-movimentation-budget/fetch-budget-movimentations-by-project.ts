import { Eihter, left, right } from "../../../../../core/either";
import { Budget } from "../../../enterprise/entities/budget";
import { Movimentation } from "../../../enterprise/entities/movimentation";
import { BudgetRepository } from "../../repositories/budget-repository";
import { MovimentationRepository } from "../../repositories/movimentation-repository";
import { ProjectRepository } from "../../repositories/project-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchBudgetMovimentationByProjectUseCaseRequest {
  project_number: string;
}

type FetchBudgetMovimentationByProjectUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    movimentations: Movimentation[];
    budgets: Budget[];
  }
>;

export class FetchBudgetMovimentationByProjecUseCase {
  constructor(
    private movimentationRepository: MovimentationRepository,
    private projectRepository: ProjectRepository,
    private budgetRepository: BudgetRepository
  ) {}

  async execute({
    project_number,
  }: FetchBudgetMovimentationByProjectUseCaseRequest): Promise<FetchBudgetMovimentationByProjectUseCaseResponse> {
    const project = await this.projectRepository.findByProjectNumber(
      project_number
    );

    if (!project) return left(new ResourceNotFoundError());

    const movimentations = await this.movimentationRepository.findByProject(
      project.id.toString()
    );

    const budgets = await this.budgetRepository.findByProject(
      project.id.toString()
    );

    // if (!movimentations.length) return left(new ResourceNotFoundError());

    return right({ movimentations, budgets });
  }
}
