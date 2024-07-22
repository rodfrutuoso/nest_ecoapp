import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMovimentationRepository } from "../../../../../../test/repositories/in-memory-movimentation-repository";
import { makeMovimentation } from "../../../../../../test/factories/make-movimentation";
import { makeBudget } from "../../../../../../test/factories/make-budget";
import { InMemoryProjectRepository } from "../../../../../../test/repositories/in-memory-project-repository";
import { InMemoryBudgetRepository } from "../../../../../../test/repositories/in-memory-budget-repository";
import { FetchBudgetMovimentationByProjecUseCase } from "./fetch-budget-movimentations-by-project";
import { makeProject } from "../../../../../../test/factories/make-project";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
let inMemoryProjectRepository: InMemoryProjectRepository;
let inMemoryBudgetRepository: InMemoryBudgetRepository;
let sut: FetchBudgetMovimentationByProjecUseCase;

describe("Fetch budgets and Movimentations by project", () => {
  beforeEach(() => {
    inMemoryMovimentationRepository = new InMemoryMovimentationRepository();
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    sut = new FetchBudgetMovimentationByProjecUseCase(
      inMemoryMovimentationRepository,
      inMemoryProjectRepository,
      inMemoryBudgetRepository
    );
  });

  it("should be able to fetch budgets and movimentations by project", async () => {
    const newProject = makeProject({ project_number: "Obra-teste" });

    await inMemoryProjectRepository.create(newProject);

    const newMovimentation1 = makeMovimentation({
      projectId: newProject.id,
    });
    const newMovimentation2 = makeMovimentation({
      projectId: newProject.id,
    });
    const newMovimentation3 = makeMovimentation({});

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const newBudget1 = makeBudget({
      projectId: newProject.id,
    });
    const newBudget2 = makeBudget({
      projectId: newProject.id,
    });
    const newBudget3 = makeBudget({});

    await inMemoryBudgetRepository.create(newBudget1);
    await inMemoryBudgetRepository.create(newBudget2);
    await inMemoryBudgetRepository.create(newBudget3);

    const result = await sut.execute({
      project_number: "Obra-teste",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.movimentations).toHaveLength(2);
      expect(result.value.budgets).toHaveLength(2);
    }
  });

  it("should not be able to fetch budgets and movimentations if the project was not found", async () => {
    const newProject = makeProject({ project_number: "Obra-teste" });

    await inMemoryProjectRepository.create(newProject);

    const newMovimentation1 = makeMovimentation({
      projectId: newProject.id,
    });
    const newMovimentation2 = makeMovimentation({
      projectId: newProject.id,
    });
    const newMovimentation3 = makeMovimentation({});

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const newBudget1 = makeBudget({
      projectId: newProject.id,
    });
    const newBudget2 = makeBudget({
      projectId: newProject.id,
    });
    const newBudget3 = makeBudget({});

    await inMemoryBudgetRepository.create(newBudget1);
    await inMemoryBudgetRepository.create(newBudget2);
    await inMemoryBudgetRepository.create(newBudget3);

    const result = await sut.execute({
      project_number: "Obra-teste2",
    });

    expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
