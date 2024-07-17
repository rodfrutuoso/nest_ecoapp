import { beforeEach, describe, expect, it, test } from "vitest";
import { RegisterProjectUseCase } from "./register-project";
import { InMemoryProjectRepository } from "../../../../../../test/repositories/in-memory-project-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

let inMemoryProjectRepository: InMemoryProjectRepository;
let sut: RegisterProjectUseCase;

describe("Create project", () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    sut = new RegisterProjectUseCase(inMemoryProjectRepository);
  });

  it("Sould be able to create a project", async () => {
    const result = await sut.execute({
      project_number: "B-10101010",
      description: "fazenda-num-sei-das-quantas-POV-onde-judas-perdeu-as-botas",
      type: "obra",
      baseId: "VCA",
      city: "Lagedo do Tabocal",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value?.project.project_number).toEqual("B-10101010");
      expect(result.value?.project.type).toEqual("obra");
      expect(result.value?.project.activeAlmoxID).toBeFalsy();
    }
    expect(inMemoryProjectRepository.items[0].id).toBeTruthy();
  });

  it("Sould not be able to create a project if project_number is already registered", async () => {
    await sut.execute({
      project_number: "B-10101010",
      description: "fazenda-num-sei-das-quantas-POV-onde-judas-perdeu-as-botas",
      type: "obra",
      baseId: "VCA",
      city: "Lagedo do Tabocal",
    });

    const result = await sut.execute({
      project_number: "B-10101010",
      description: "fazenda-num-sei-das-quantas-POV-onde-judas-perdeu-as-botas",
      type: "obra",
      baseId: "VCA",
      city: "Lagedo do Tabocal",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceAlreadyRegisteredError);
  });
});
