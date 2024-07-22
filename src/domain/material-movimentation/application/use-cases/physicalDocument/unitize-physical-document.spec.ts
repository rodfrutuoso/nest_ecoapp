import { beforeEach, describe, expect, it, test } from "vitest";
import { UnitizePhysicalDocumentUseCase } from "./unitize-physical-document";
import { InMemoryPhysicalDocumentRepository } from "../../../../../../test/repositories/in-memory-physical-document-repository";
import { makePhysicalDocument } from "../../../../../../test/factories/make-physical-document";

let inMemoryPhysicalDocumentRepository: InMemoryPhysicalDocumentRepository;
let sut: UnitizePhysicalDocumentUseCase;

describe("Unitize PhysicalDocument", () => {
  beforeEach(() => {
    inMemoryPhysicalDocumentRepository =
      new InMemoryPhysicalDocumentRepository();
    sut = new UnitizePhysicalDocumentUseCase(
      inMemoryPhysicalDocumentRepository
    );
  });

  it("sould be able to unitize a physicaldocument", async () => {
    const physicaldocument = makePhysicalDocument({unitized: false});

    await inMemoryPhysicalDocumentRepository.create(physicaldocument);

    const result = await sut.execute({
      id: physicaldocument.id.toString(),
      unitized: true,
    });

    expect(result.isRight())
    expect(inMemoryPhysicalDocumentRepository.items[0]).toMatchObject({
      props: {
        unitized: true,
      },
    });
  });
});
