import { beforeEach, describe, expect, it } from "vitest";
import { RegisterEstimatorUseCase } from "./register-estimator";
import { InMemoryEstimatorRepository } from "test/repositories/in-memory-estimator-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeBase } from "test/factories/make-base";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { WrongTypeError } from "../errors/wrong-type";
import { makeContract } from "test/factories/make-contract";

let inMemoryEstimatorRepository: InMemoryEstimatorRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let fakeHasher: FakeHasher;
let sut: RegisterEstimatorUseCase;

describe("Create estimator", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryEstimatorRepository = new InMemoryEstimatorRepository(
      inMemoryContractRepository
    );
    fakeHasher = new FakeHasher();
    sut = new RegisterEstimatorUseCase(
      inMemoryEstimatorRepository,
      fakeHasher,
      inMemoryBaseRepository
    );
  });

  it("Sould be able to register a estimator", async () => {
    const contract = makeContract();
    await inMemoryContractRepository.create(contract);

    const base = makeBase({ contractId: contract.id });
    await inMemoryBaseRepository.create(base);

    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "Orçamentista",
      contractId: contract.id.toString(),
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.estimator.status).toBeTruthy();
      expect(result.value.estimator.password).toEqual(hashedPassword);
    }
    expect(inMemoryEstimatorRepository.items[0].id).toBeTruthy();
  });

  it("Sould not be able to register a estimator if contractId does not exist", async () => {
    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "Orçamentista",
      contractId: "contract-1",
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("Sould not be able to register a estimator if type is not valid", async () => {
    const contract = makeContract();
    await inMemoryContractRepository.create(contract);

    const base = makeBase({ contractId: contract.id });
    await inMemoryBaseRepository.create(base);

    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "Assistente",
      contractId: contract.id.toString(),
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongTypeError);
  });
});
