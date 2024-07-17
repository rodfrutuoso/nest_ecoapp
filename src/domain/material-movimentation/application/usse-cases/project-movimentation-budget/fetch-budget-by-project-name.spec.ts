import { beforeEach, describe, expect, it } from "vitest";
import { FetchBudgetByProjectNameUseCase } from "./fetch-budget-by-project-name";
import { InMemoryProjectRepository } from "../../../../../../test/repositories/in-memory-project-repository";
import { InMemoryBudgetRepository } from "../../../../../../test/repositories/in-memory-budget-repository";
import { makeBudget } from "../../../../../../test/factories/make-budget";
import { makeProject } from "../../../../../../test/factories/make-project";

let inMeomoryProjectRepository: InMemoryProjectRepository;
let inMemoryBudgetRepository: InMemoryBudgetRepository;
let sut: FetchBudgetByProjectNameUseCase;

describe("Get Budget by project", () => {
  beforeEach(() => {
    inMeomoryProjectRepository = new InMemoryProjectRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository();
    sut = new FetchBudgetByProjectNameUseCase(
      inMemoryBudgetRepository,
      inMeomoryProjectRepository
    );
  });

  it("should be able to get an array of budgets by project", async () => {
    const newProject = makeProject({ project_number: "B-10101010" });

    await inMeomoryProjectRepository.create(newProject);

    const newBudget1 = makeBudget({
      projectId: newProject.id,
      value: 5,
    });
    const newBudget2 = makeBudget({ projectId: newProject.id });
    const newBudget3 = makeBudget({
      projectId: newProject.id,
    });

    await inMemoryBudgetRepository.create(newBudget1);
    await inMemoryBudgetRepository.create(newBudget2);
    await inMemoryBudgetRepository.create(newBudget3);

    const result = await sut.execute({
      project_number: "B-10101010",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.budgets[0].value).toEqual(5);
    expect(inMeomoryProjectRepository.items[0].id).toBeTruthy();
    expect(inMemoryBudgetRepository.items[2].id).toBeTruthy();
  });
});
