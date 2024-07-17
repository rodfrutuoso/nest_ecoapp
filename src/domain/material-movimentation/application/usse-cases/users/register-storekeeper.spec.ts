import { beforeEach, describe, expect, it, test } from "vitest";
import { RegisterStorekeeperUseCase } from "./register-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: RegisterStorekeeperUseCase;

describe("Create storekeeper", () => {
  beforeEach(() => {
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository();
    sut = new RegisterStorekeeperUseCase(inMemoryStorekeeperRepository);
  });

  it("Sould be able to register a storekeeper", async () => {
    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "administrador",
      baseId: "base-1",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value?.storekeeper.status).toBeTruthy();
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
    });

    const result = await sut.execute({
      name: "Rodrigo",
      email: "rodrigo@ecoeletrica.com.br",
      cpf: "12345678901",
      type: "administrador",
      baseId: "base-1",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });
});
