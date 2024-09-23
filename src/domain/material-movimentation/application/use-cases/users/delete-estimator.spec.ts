import { beforeEach, describe, expect, it } from "vitest";
import { DeleteEstimatorUseCase } from "./delete-estimator";
import { InMemoryEstimatorRepository } from "../../../../../../test/repositories/in-memory-estimator-repository";
import { makeEstimator } from "../../../../../../test/factories/make-estimator";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";

let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let sut: DeleteEstimatorUseCase;

describe("Delete Estimator", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository(
      inMemoryContractRepository
    );
    sut = new DeleteEstimatorUseCase(inMemoryEstimatorRepository);
  });

  it("sould be able to delete a estimator", async () => {
    const estimator = makeEstimator();
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      authorType: "Administrador",
      estimatorId: estimator.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryEstimatorRepository.items).toHaveLength(0); // there'll be only the author
  });

  it("sould not be able to delete a estimator if the author is not 'Administrador'", async () => {
    const estimator = makeEstimator();
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      authorType: "Orçamentista",
      estimatorId: estimator.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryEstimatorRepository.items).toHaveLength(1);
  });
});
