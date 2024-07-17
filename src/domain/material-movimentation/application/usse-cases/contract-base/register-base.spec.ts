import { beforeEach, describe, expect, it } from "vitest";
import { RegisterBaseUseCase } from "./register-base";
import { InMemoryBaseRepository } from "../../../../../../test/repositories/in-memory-base-repository";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

let inMemoryBaseRepository: InMemoryBaseRepository;
let sut: RegisterBaseUseCase;

describe("Create Base", () => {
  beforeEach(() => {
    inMemoryBaseRepository = new InMemoryBaseRepository();
    sut = new RegisterBaseUseCase(inMemoryBaseRepository);
  });

  it("sould be able to create a base", async () => {
    const result = await sut.execute({
      baseName: "Vitória da Conquista",
      contractID: "Contrato 1",
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryBaseRepository.items[0].baseName).toEqual(
      "Vitória da Conquista"
    );
    expect(inMemoryBaseRepository.items[0].contractID).toBeInstanceOf(
      UniqueEntityID
    );
  });

  it("Sould not be able to register a base if baseName is already registered", async () => {
    const registerBase = new RegisterBaseUseCase(
      inMemoryBaseRepository
    );

    await registerBase.execute({
      baseName: "Vitória da Conquista",
      contractID: "Contrato 1",
    });

    const result = await registerBase.execute({
      baseName: "Vitória da Conquista",
      contractID: "Contrato 1",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });
});
