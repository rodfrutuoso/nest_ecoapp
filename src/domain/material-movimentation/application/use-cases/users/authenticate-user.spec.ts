import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { makeStorekeeper } from "test/factories/make-storekeeper";
import { WrogCredentialsError } from "../errors/wrong-credentials";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryEstimatorRepository } from "test/repositories/in-memory-estimator-repository";
import { makeEstimator } from "test/factories/make-estimator";

let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe("authenticate storekeeper", () => {
  beforeEach(() => {
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository();
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryStorekeeperRepository,
      inMemoryEstimatorRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("Sould be able to authenticate a storekeeper", async () => {
    const storekeeper = makeStorekeeper({
      email: "rodrigo@ecoeletrica.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      email: "rodrigo@ecoeletrica.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("Sould be able to authenticate a estimator", async () => {
    const estimator = makeEstimator({
      email: "rodrigo@ecoeletrica.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      email: "rodrigo@ecoeletrica.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("Sould not be able to authenticate a storekeeper with wrong password", async () => {
    const storekeeper = makeStorekeeper({
      email: "rodrigo@ecoeletrica.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      email: "rodrigo@ecoeletrica.com",
      password: "12345",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrogCredentialsError);
  });
});
