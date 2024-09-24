import { beforeEach, describe, expect, it } from "vitest";
import { FetchEstimatorUseCase } from "./fetch-estimator";
import { InMemoryEstimatorRepository } from "../../../../../../test/repositories/in-memory-estimator-repository";
import { makeEstimator } from "../../../../../../test/factories/make-estimator";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeContract } from "test/factories/make-contract";
import { makeBase } from "test/factories/make-base";

let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let sut: FetchEstimatorUseCase;

describe("Fetch Estimators History", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository(
      inMemoryContractRepository
    );
    sut = new FetchEstimatorUseCase(inMemoryEstimatorRepository);
  });

  it("should be able to fetch estimator sorting by name", async () => {
    const contract = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract);

    const newEstimator1 = makeEstimator({
      name: "Bruno",
      contractId: contract.id,
    });
    const newEstimator2 = makeEstimator({
      name: "Ana",
      contractId: contract.id,
    });
    const newEstimator3 = makeEstimator({
      name: "Carlos",
      contractId: contract.id,
    });

    await inMemoryEstimatorRepository.create(newEstimator1);
    await inMemoryEstimatorRepository.create(newEstimator2);
    await inMemoryEstimatorRepository.create(newEstimator3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.estimators).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({ name: "Ana" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ name: "Bruno" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ name: "Carlos" }),
        }),
      ]);
  });

  it("should be able to fetch paginated estimators history", async () => {
    const contract = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract);

    for (let i = 1; i <= 45; i++) {
      await inMemoryEstimatorRepository.create(
        makeEstimator({ contractId: contract.id })
      );
    }

    const result = await sut.execute({
      page: 2,
    });
    if (result.isRight()) expect(result.value.estimators).toHaveLength(5);
  });

  it("should be able to fetch estimators history by contract", async () => {
    const contract1 = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract1);

    const contract2 = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract2);

    const newEstimator1 = makeEstimator({
      contractId: contract1.id,
    });
    const newEstimator2 = makeEstimator({
      contractId: contract1.id,
    });
    const newEstimator3 = makeEstimator({
      contractId: contract2.id,
    });

    await inMemoryEstimatorRepository.create(newEstimator1);
    await inMemoryEstimatorRepository.create(newEstimator2);
    await inMemoryEstimatorRepository.create(newEstimator3);

    const result = await sut.execute({
      page: 1,
      contractId: contract1.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) expect(result.value.estimators).toHaveLength(2);
  });

  it("should be able to fetch estimator by name", async () => {
    const contract = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract);

    const newEstimator1 = makeEstimator({
      name: "Bruno Carlos",
      contractId: contract.id,
    });
    const newEstimator2 = makeEstimator({
      name: "Bruno José",
      contractId: contract.id,
    });
    const newEstimator3 = makeEstimator({
      name: "Carlos",
      contractId: contract.id,
    });

    await inMemoryEstimatorRepository.create(newEstimator1);
    await inMemoryEstimatorRepository.create(newEstimator2);
    await inMemoryEstimatorRepository.create(newEstimator3);

    const result = await sut.execute({
      page: 1,
      name: "Bruno",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.estimators).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({ name: "Bruno Carlos" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ name: "Bruno José" }),
        }),
      ]);
  });
});
