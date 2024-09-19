import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMovimentationRepository } from "../../../../../../test/repositories/in-memory-movimentation-repository";
import { makeMovimentation } from "../../../../../../test/factories/make-movimentation";
import { makeBudget } from "../../../../../../test/factories/make-budget";
import { InMemoryProjectRepository } from "../../../../../../test/repositories/in-memory-project-repository";
import { InMemoryBudgetRepository } from "../../../../../../test/repositories/in-memory-budget-repository";
import { FetchBudgetMovimentationByProjectUseCase } from "./fetch-budget-movimentations-by-project";
import { makeProject } from "../../../../../../test/factories/make-project";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryMaterialRepository } from "test/repositories/in-memory-material-repository";
import { InMemoryStorekeeperRepository } from "test/repositories/in-memory-storekeeper-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { InMemoryEstimatorRepository } from "test/repositories/in-memory-estimator-repository";
import { makeContract } from "test/factories/make-contract";
import { makeBase } from "test/factories/make-base";
import { makeStorekeeper } from "test/factories/make-storekeeper";
import { makeMaterial } from "test/factories/make-material";
import { makeEstimator } from "test/factories/make-estimator";

let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
let inMemoryProjectRepository: InMemoryProjectRepository;
let inMemoryBudgetRepository: InMemoryBudgetRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryMaterialRepository: InMemoryMaterialRepository;
let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let sut: FetchBudgetMovimentationByProjectUseCase;

describe("Fetch budgets and Movimentations by project", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryMaterialRepository = new InMemoryMaterialRepository();
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository();
    inMemoryProjectRepository = new InMemoryProjectRepository(
      inMemoryBaseRepository
    );
    inMemoryMovimentationRepository = new InMemoryMovimentationRepository(
      inMemoryStorekeeperRepository,
      inMemoryMaterialRepository,
      inMemoryProjectRepository,
      inMemoryBaseRepository
    );
    inMemoryBudgetRepository = new InMemoryBudgetRepository(
      inMemoryEstimatorRepository,
      inMemoryMaterialRepository,
      inMemoryProjectRepository,
      inMemoryContractRepository,
      inMemoryBaseRepository
    );
    sut = new FetchBudgetMovimentationByProjectUseCase(
      inMemoryMovimentationRepository,
      inMemoryProjectRepository,
      inMemoryBudgetRepository
    );
  });

  it("should be able to fetch budgets and movimentations by project", async () => {
    // entity creation for details
    const contract = makeContract();
    await inMemoryContractRepository.create(contract);

    const base = makeBase({ contractId: contract.id });
    await inMemoryBaseRepository.create(base);

    const storekeeper = makeStorekeeper({ baseId: base.id });
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({ contractId: contract.id });
    await inMemoryEstimatorRepository.create(estimator);

    const material = makeMaterial({ contractId: contract.id });
    await inMemoryMaterialRepository.create(material);

    const newProject = makeProject({
      project_number: "Obra-teste",
      baseId: base.id,
    });
    await inMemoryProjectRepository.create(newProject);

    const newProject2 = makeProject({
      project_number: "Obra-teste2",
      baseId: base.id,
    });
    await inMemoryProjectRepository.create(newProject2);

    const newMovimentation1 = makeMovimentation({
      projectId: newProject.id,
      baseId: base.id,
      materialId: material.id,
      storekeeperId: storekeeper.id,
    });
    const newMovimentation2 = makeMovimentation({
      projectId: newProject.id,
      baseId: base.id,
      materialId: material.id,
      storekeeperId: storekeeper.id,
    });
    const newMovimentation3 = makeMovimentation({
      projectId: newProject2.id,
      baseId: base.id,
      materialId: material.id,
      storekeeperId: storekeeper.id,
    });

    await inMemoryMovimentationRepository.create([
      newMovimentation1,
      newMovimentation2,
      newMovimentation3,
    ]);

    const newBudget1 = makeBudget({
      projectId: newProject.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });
    const newBudget2 = makeBudget({
      projectId: newProject.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });
    const newBudget3 = makeBudget({
      projectId: newProject2.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });

    await inMemoryBudgetRepository.create([newBudget1, newBudget2, newBudget3]);

    const result = await sut.execute({
      project_number: "Obra-teste",
      baseId: base.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.movimentations).toHaveLength(2);
      expect(result.value.budgets).toHaveLength(2);
    }
  });

  it("should not be able to fetch budgets and movimentations if the project was not found", async () => {
    // entity creation for details
    const contract = makeContract();
    inMemoryContractRepository.create(contract);

    const base = makeBase({ contractId: contract.id });
    inMemoryBaseRepository.create(base);

    const storekeeper = makeStorekeeper({ baseId: base.id });
    inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({ contractId: contract.id });
    inMemoryEstimatorRepository.create(estimator);

    const material = makeMaterial();
    inMemoryMaterialRepository.create(material);

    const newProject = makeProject({
      project_number: "Obra-teste",
      baseId: base.id,
    });
    await inMemoryProjectRepository.create(newProject);

    const newMovimentation1 = makeMovimentation({
      projectId: newProject.id,
      baseId: base.id,
      materialId: material.id,
      storekeeperId: storekeeper.id,
    });
    const newMovimentation2 = makeMovimentation({
      projectId: newProject.id,
      baseId: base.id,
      materialId: material.id,
      storekeeperId: storekeeper.id,
    });
    const newMovimentation3 = makeMovimentation({
      projectId: newProject.id,
      baseId: base.id,
      materialId: material.id,
      storekeeperId: storekeeper.id,
    });

    await inMemoryMovimentationRepository.create([
      newMovimentation1,
      newMovimentation2,
      newMovimentation3,
    ]);

    const newBudget1 = makeBudget({
      projectId: newProject.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });
    const newBudget2 = makeBudget({
      projectId: newProject.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });
    const newBudget3 = makeBudget({
      projectId: newProject.id,
      contractId: contract.id,
      materialId: material.id,
      estimatorId: estimator.id,
    });

    await inMemoryBudgetRepository.create([newBudget1]);
    await inMemoryBudgetRepository.create([newBudget2]);
    await inMemoryBudgetRepository.create([newBudget3]);

    const result = await sut.execute({
      project_number: "Obra-teste2",
      baseId: base.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
