import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryStorekeeperRepository } from "test/repositories/in-memory-storekeeper-repository";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeStorekeeper } from "test/factories/make-storekeeper";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { InMemoryEstimatorRepository } from "test/repositories/in-memory-estimator-repository";
import { VerifyAuthorTypeUseCase } from "./verify-author-type";
import { makeEstimator } from "test/factories/make-estimator";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let sut: VerifyAuthorTypeUseCase;

describe("Verify Author and User", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    sut = new VerifyAuthorTypeUseCase(
      inMemoryStorekeeperRepository,
      inMemoryEstimatorRepository
    );
  });

  it("Should be able to verify if an authorId and userId exist", async () => {
    const storekeeper = makeStorekeeper({}, new UniqueEntityID("almoxarife"));
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({}, new UniqueEntityID("orçamentista"));
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      authorId: "almoxarife",
      userId: "orçamentista",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.author.id.toString()).toEqual("almoxarife");
      expect(result.value.user.id.toString()).toEqual("orçamentista");
    }
  });

  it("Should not be able to verify if an authorId and userId if author was not found", async () => {
    const storekeeper = makeStorekeeper({}, new UniqueEntityID("almoxarife"));
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({}, new UniqueEntityID("orçamentista"));
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      authorId: "almoxarife-teste",
      userId: "orçamentista",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    if (result.isLeft()) expect(result.value.message).contains("autor");
  });

  it("Should not be able to verify if an authorId and userId if user was not found", async () => {
    const storekeeper = makeStorekeeper({}, new UniqueEntityID("almoxarife"));
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({}, new UniqueEntityID("orçamentista"));
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      authorId: "almoxarife",
      userId: "orçamentista-teste",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    if (result.isLeft()) expect(result.value.message).contains("usuário");
  });
});
