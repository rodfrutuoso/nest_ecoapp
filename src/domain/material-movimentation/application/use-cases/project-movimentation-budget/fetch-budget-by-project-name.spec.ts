import { beforeEach, describe, expect, it } from "vitest";
import { FetchBudgetByProjectNameUseCase } from "./fetch-budget-by-project-name";
import { InMemoryProjectRepository } from "../../../../../../test/repositories/in-memory-project-repository";
import { InMemoryBudgetRepository } from "../../../../../../test/repositories/in-memory-budget-repository";
import { makeBudget } from "../../../../../../test/factories/make-budget";
import { makeProject } from "../../../../../../test/factories/make-project";
import { InMemoryMaterialRepository } from "test/repositories/in-memory-material-repository";
import { InMemoryEstimatorRepository } from "test/repositories/in-memory-estimator-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeContract } from "test/factories/make-contract";
import { makeEstimator } from "test/factories/make-estimator";
import { makeMaterial } from "test/factories/make-material";

let inMemoryMaterialRepository: InMemoryMaterialRepository;
let inMemoryProjectRepository: InMemoryProjectRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBudgetRepository: InMemoryBudgetRepository;
let sut: FetchBudgetByProjectNameUseCase;

describe("Get Budget by project", () => {
  beforeEach(() => {
    inMemoryMaterialRepository = new InMemoryMaterialRepository();
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository();
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryBudgetRepository = new InMemoryBudgetRepository(
      inMemoryEstimatorRepository,
      inMemoryMaterialRepository,
      inMemoryProjectRepository,
      inMemoryContractRepository
    );
    sut = new FetchBudgetByProjectNameUseCase(
      inMemoryBudgetRepository,
      inMemoryProjectRepository
    );
  });

  it("should be able to get an array of budgets by project", async () => {
    // entity creation for details
    const contract = makeContract();
    inMemoryContractRepository.create(contract);

    const estimator = makeEstimator({ contractId: contract.id });
    inMemoryEstimatorRepository.create(estimator);

    const material = makeMaterial();
    inMemoryMaterialRepository.create(material);

    const project = makeProject({ project_number: "B-10101010" });
    inMemoryProjectRepository.create(project);

    const newBudget1 = makeBudget({
      projectId: project.id,
      value: 5,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });
    const newBudget2 = makeBudget({
      projectId: project.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });
    const newBudget3 = makeBudget({
      projectId: project.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });

    await inMemoryBudgetRepository.create(newBudget1);
    await inMemoryBudgetRepository.create(newBudget2);
    await inMemoryBudgetRepository.create(newBudget3);

    const result = await sut.execute({
      project_number: "B-10101010",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) expect(result.value.budgets[0].value).toEqual(5);
    expect(inMemoryProjectRepository.items[0].id).toBeTruthy();
    expect(inMemoryBudgetRepository.items[2].id).toBeTruthy();
  });
});
