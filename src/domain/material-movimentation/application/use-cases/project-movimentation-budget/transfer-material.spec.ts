import { beforeEach, describe, expect, it } from "vitest";
import { TransferMaterialUseCase } from "./transfer-material";
import { InMemoryMovimentationRepository } from "../../../../../../test/repositories/in-memory-movimentation-repository";

let inMeomoryMovimentationRepository: InMemoryMovimentationRepository;
let sut: TransferMaterialUseCase;

describe("Transfer Material", () => {
  beforeEach(() => {
    inMeomoryMovimentationRepository = new InMemoryMovimentationRepository();
    sut = new TransferMaterialUseCase(inMeomoryMovimentationRepository);
  });

  it("should be able to transfer a material", async () => {
    const result = await sut.execute([
      {
        projectId: "1",
        materialId: "4",
        storekeeperId: "5",
        observation: "Material Movimentado",
        baseId: "ID-BASE-VCA",
        value: 5,
      },
    ]);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.movimentations[0].value).toEqual(5);
      expect(result.value.movimentations[0].observation).toEqual(
        "Material Movimentado"
      );
    }
    expect(inMeomoryMovimentationRepository.items[0].id).toBeTruthy();
  });
});
