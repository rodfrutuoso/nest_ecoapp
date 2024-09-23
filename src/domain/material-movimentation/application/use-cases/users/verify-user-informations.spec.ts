import { beforeEach, describe, expect, it } from "vitest";
import { RegisterStorekeeperUseCase } from "./register-storekeeper";
import { InMemoryStorekeeperRepository } from "test/repositories/in-memory-storekeeper-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeBase } from "test/factories/make-base";
import { makeStorekeeper } from "test/factories/make-storekeeper";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { WrongTypeError } from "../errors/wrong-type";
import { InMemoryEstimatorRepository } from "test/repositories/in-memory-estimator-repository";
import { VerifyUserInformationsUseCase } from "./verify-user-informations";
import { makeEstimator } from "test/factories/make-estimator";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let sut: VerifyUserInformationsUseCase;

describe("Verify User Informations", () => {
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
    sut = new VerifyUserInformationsUseCase(
      inMemoryStorekeeperRepository,
      inMemoryEstimatorRepository
    );
  });

  it("Should be able to verify if an email or cpf is already registered", async () => {
    const storekeeper = makeStorekeeper({
      email: "test@ecoeletrica.com.br",
      cpf: "00011122233",
    });
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({
      email: "test2@ecoeletrica.com.br",
      cpf: "00011122244",
    });
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      email: "test2@ecoeletrica.com.br",
      cpf: "00011122233",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });

  it("Should be able to verify if an email or cpf is already registered by a storekeeper", async () => {
    const storekeeper = makeStorekeeper({
      email: "test@ecoeletrica.com.br",
      cpf: "00011122233",
    });
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({
      email: "test2@ecoeletrica.com.br",
      cpf: "00011122244",
    });
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      email: "test@ecoeletrica.com.br",
      cpf: "00011122255",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });

  it("Should be able to verify if an email or cpf is already registered by a estimator", async () => {
    const storekeeper = makeStorekeeper({
      email: "test@ecoeletrica.com.br",
      cpf: "00011122233",
    });
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({
      email: "test2@ecoeletrica.com.br",
      cpf: "00011122244",
    });
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      email: "test3@ecoeletrica.com.br",
      cpf: "00011122244",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });

  it("Should be able to verify if an email or cpf is not already registered", async () => {
    const storekeeper = makeStorekeeper({
      email: "test@ecoeletrica.com.br",
      cpf: "00011122233",
    });
    await inMemoryStorekeeperRepository.create(storekeeper);

    const estimator = makeEstimator({
      email: "test2@ecoeletrica.com.br",
      cpf: "00011122244",
    });
    await inMemoryEstimatorRepository.create(estimator);

    const result = await sut.execute({
      email: "test3@ecoeletrica.com.br",
      cpf: "00011122255",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBeTruthy();
  });
});
