import { beforeEach, describe, expect, it } from "vitest";
import { TransferMovimentationBetweenProjectsUseCase } from "./transfer-movimentation-between-projects";
import { InMemoryMovimentationRepository } from "../../../../../../test/repositories/in-memory-movimentation-repository";
import { makeMovimentation } from "../../../../../../test/factories/make-movimentation";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
let sut: TransferMovimentationBetweenProjectsUseCase;

describe("Transfer Material between projects", () => {
  beforeEach(() => {
    inMemoryMovimentationRepository = new InMemoryMovimentationRepository();
    sut = new TransferMovimentationBetweenProjectsUseCase(
      inMemoryMovimentationRepository
    );
  });

  it("should be able to transfer a material between projects", async () => {
    const movimentation = makeMovimentation({
      projectId: new UniqueEntityID("Projeto-origem"),
      materialId: new UniqueEntityID("Material-teste"),
      value: 5,
    });

    await inMemoryMovimentationRepository.create(movimentation);

    const result = await sut.execute({
      projectIdOut: "Projeto-origem",
      projectIdIn: "Projeto-destino",
      materialId: "Material-teste",
      storekeeperId: "5",
      observation: "transferencia para terminar obra prioritária",
      baseID: "ID-BASE-VCA",
      value: 4,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) {
      expect(result.value.movimentationIn.value).toEqual(4);
      expect(result.value.movimentationOut.value).toEqual(-4);
      expect(result.value.movimentationOut.observation).toEqual(
        "transferencia para terminar obra prioritária"
      );
    }
    expect(inMemoryMovimentationRepository.items[0].id).toBeTruthy();
  });

  it("should not be able to transfer a material between projects if the in value is bigger than out value", async () => {
    const movimentation = makeMovimentation({
      projectId: new UniqueEntityID("Projeto-origem"),
      materialId: new UniqueEntityID("Material-teste"),
      value: 3,
    });

    await inMemoryMovimentationRepository.create(movimentation);

    const result = await sut.execute({
      projectIdOut: "Projeto-origem",
      projectIdIn: "Projeto-destino",
      materialId: "Material-teste",
      storekeeperId: "5",
      observation: "transferencia para terminar obra prioritária",
      baseID: "ID-BASE-VCA",
      value: 4,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  });
});
