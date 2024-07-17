import { beforeEach, describe, expect, it } from "vitest";
import { DeletePhysicalDocumentUseCase } from "./delete-physical-document";
import { InMemoryPhysicalDocumentRepository } from "../../../../../../test/repositories/in-memory-physical-document-repository";
import { makePhysicalDocument } from "../../../../../../test/factories/make-physical-document";
import { NotAllowedError } from "../errors/not-allowed-error";

let inMemoryPhysicalDocumentRepository: InMemoryPhysicalDocumentRepository;
let sut: DeletePhysicalDocumentUseCase;

describe("Delete PhysicalDocument", () => {
  beforeEach(() => {
    inMemoryPhysicalDocumentRepository =
      new InMemoryPhysicalDocumentRepository();
    sut = new DeletePhysicalDocumentUseCase(inMemoryPhysicalDocumentRepository);
  });

  it("sould be able to delete a physicaldocument", async () => {
    const physicaldocument = makePhysicalDocument();

    await inMemoryPhysicalDocumentRepository.create(physicaldocument);

    await sut.execute({
      physicalDocumentId: physicaldocument.id.toString(),
    });

    expect(inMemoryPhysicalDocumentRepository.items).toHaveLength(0); // there'll be only the author
  });
});
