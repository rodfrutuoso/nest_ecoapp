import { beforeEach, describe, expect, it } from "vitest";
import { CreateMaterialUseCase } from "./create-material";
import { InMemoryMaterialRepository } from "../../../../../../test/repositories/in-memory-material-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

let inMemoryMaterialRepository: InMemoryMaterialRepository;
let sut: CreateMaterialUseCase;

describe("Create Material", () => {
  beforeEach(() => {
    inMemoryMaterialRepository = new InMemoryMaterialRepository();
    sut = new CreateMaterialUseCase(inMemoryMaterialRepository);
  });

  it("sould be able to create a material", async () => {
    const result = await sut.execute({
      code: 32142141,
      description: "Material não sei das quantas",
      type: "concreto",
      unit: "CDA",
      contractId: "contrato-1",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.material.code).toEqual(32142141);
      expect(result.value.material.type).toEqual("concreto");
    }
    expect(inMemoryMaterialRepository.items[0].id).toBeTruthy();
  });

  it("sould not be able to create a material that code is already registered", async () => {
    await sut.execute({
      code: 32142141,
      description: "Material não sei das",
      type: "ferragem",
      unit: "UN",
      contractId: "contrato-1",
    });

    const result = await sut.execute({
      code: 32142141,
      description: "Material não sei das quantas",
      type: "concreto",
      unit: "CDA",
      contractId: "contrato-1",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });
});
