import { beforeEach, describe, expect, it, test } from "vitest";
import { EditEstimatorUseCase } from "./edit-estimator";
import { InMemoryEstimatorRepository } from "../../../../../../test/repositories/in-memory-estimator-repository";
import { makeEstimator } from "../../../../../../test/factories/make-estimator";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeBase } from "test/factories/make-base";
import { makeContract } from "test/factories/make-contract";
import { NotAllowedError } from "../errors/not-allowed-error";

let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let sut: EditEstimatorUseCase;
let fakeHasher: FakeHasher;

describe("Edit Estimator", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository(
      inMemoryContractRepository
    );
    fakeHasher = new FakeHasher();
    sut = new EditEstimatorUseCase(
      inMemoryEstimatorRepository,
      fakeHasher,
      inMemoryContractRepository
    );
  });

  it("sould be able to edit a estimator", async () => {
    const contract = makeContract(
      {},
      new UniqueEntityID("Vitória da Conquista")
    );
    await inMemoryContractRepository.create(contract);

    const estimator = makeEstimator();
    await inMemoryEstimatorRepository.create(estimator);

    await sut.execute({
      authorId: estimator.id.toString(),
      estimatorId: estimator.id.toString(),
      contractId: "Vitória da Conquista",
      password: "123456",
    });

    expect(inMemoryEstimatorRepository.items[0]).toMatchObject({
      props: expect.objectContaining({
        contractId: new UniqueEntityID("Vitória da Conquista"),
      }),
    });
    expect(
      await fakeHasher.compare(
        "123456",
        inMemoryEstimatorRepository.items[0].password
      )
    ).toBe(true);
  });

  it("sould not be able to edit a estimator if the author is not 'Administrador' or itself", async () => {
    const contract = makeContract(
      {},
      new UniqueEntityID("Vitória da Conquista")
    );
    await inMemoryContractRepository.create(contract);

    const author = makeEstimator({});
    const estimator = makeEstimator({
      contractId: new UniqueEntityID("Itaberaba"),
    });

    await inMemoryEstimatorRepository.create(author);
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      authorId: author.id.toString(),
      estimatorId: estimator.id.toString(),
      contractId: "Vitória da Conquista",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(inMemoryEstimatorRepository.items[1].contractId).toEqual(
      new UniqueEntityID("Itaberaba")
    );
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
