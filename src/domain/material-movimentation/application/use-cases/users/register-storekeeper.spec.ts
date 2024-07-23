import { beforeEach, describe, expect, it, test } from "vitest";
import { RegisterStorekeeperUseCase } from "./register-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStorekeeperUseCase;

describe("Create storekeeper", () => {
  beforeEach(() => {
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStorekeeperUseCase(
      inMemoryStorekeeperRepository,
      fakeHasher
    );
  });

  it("Sould be able to register a storekeeper", async () => {
    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "administrador",
      baseId: "base-1",
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

  it("Sould not be able to register a storekeeper if email is already registered", async () => {
    await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "administrador",
      baseId: "base-1",
      password: "123456",
    });

    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "administrador",
      baseId: "base-1",
      password: "123456",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });
});
