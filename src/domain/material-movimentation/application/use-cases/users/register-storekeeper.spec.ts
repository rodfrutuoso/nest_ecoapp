import { beforeEach, describe, expect, it } from "vitest";
import { RegisterStorekeeperUseCase } from "./register-storekeeper";
import { InMemoryStorekeeperRepository } from "test/repositories/in-memory-storekeeper-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeBase } from "test/factories/make-base";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { WrongTypeError } from "../errors/wrong-type";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStorekeeperUseCase;

describe("Create storekeeper", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    fakeHasher = new FakeHasher();
    sut = new RegisterStorekeeperUseCase(
      inMemoryStorekeeperRepository,
      fakeHasher,
      inMemoryBaseRepository
    );
  });

  it("Sould be able to register a storekeeper", async () => {
    const base = makeBase();
    await inMemoryBaseRepository.create(base);

    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "Administrador",
      baseId: base.id.toString(),
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.storekeeper.status).toBeTruthy();
      expect(result.value.storekeeper.password).toEqual(hashedPassword);
    }
    expect(inMemoryStorekeeperRepository.items[0].id).toBeTruthy();
  });

  
  it("Sould not be able to register a storekeeper if baseId does not exist", async () => {
    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "administrador",
      baseId: "base-1",
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("Sould not be able to register a storekeeper if type is not valid", async () => {
    const base = makeBase();
    await inMemoryBaseRepository.create(base);

    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "Assistente",
      baseId: base.id.toString(),
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongTypeError);
  });
});
