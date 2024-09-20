import { beforeEach, describe, expect, it } from "vitest";
import { GetEstimatorByIdUseCase } from "./get-estimator-by-id";
import { InMemoryEstimatorRepository } from "../../../../../../test/repositories/in-memory-estimator-repository";
import { makeEstimator } from "../../../../../../test/factories/make-estimator";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeContract } from "test/factories/make-contract";

let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let sut: GetEstimatorByIdUseCase;

describe("Fetch Estimators History", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository(
      inMemoryContractRepository
    );
    sut = new GetEstimatorByIdUseCase(inMemoryEstimatorRepository);
  });

  it("should be able to fetch physical documents history sorting by name", async () => {
    const contract = makeContract();
    await inMemoryContractRepository.create(contract);

    const newEstimator1 = makeEstimator({
      email: "rodrigo@ecoeletrica.com.br",
      contractId: contract.id,
    });

    await inMemoryEstimatorRepository.create(newEstimator1);

    const result = await sut.execute({
      estimatorId: newEstimator1.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.estimator.estimatorId).toEqual(newEstimator1.id);
  });
});
