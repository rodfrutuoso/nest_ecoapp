import { beforeEach, describe, expect, it } from "vitest";
import { FetchPhysicalDocumentUseCase } from "./fetch-physical-document";
import { InMemoryPhysicalDocumentRepository } from "../../../../../../test/repositories/in-memory-physical-document-repository";
import { makePhysicalDocument } from "../../../../../../test/factories/make-physical-document";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";

let inMemoryPhysicalDocumentRepository: InMemoryPhysicalDocumentRepository;
let sut: FetchPhysicalDocumentUseCase;

describe("Fetch PhysicalDocuments History", () => {
  beforeEach(() => {
    inMemoryPhysicalDocumentRepository = new InMemoryPhysicalDocumentRepository();
    sut = new FetchPhysicalDocumentUseCase(inMemoryPhysicalDocumentRepository);
  });

  it("should be able to fetch physical documents history sorting by identifier", async () => {
    const newPhysicalDocument1 = makePhysicalDocument({
      identifier: 3,
    });
    const newPhysicalDocument2 = makePhysicalDocument({
      identifier: 10,
    });
    const newPhysicalDocument3 = makePhysicalDocument({
      identifier: 1,
    });

    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument1);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument2);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.physicaldocuments).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({ identifier: 1 }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ identifier: 3 }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ identifier: 10 }),
        }),
      ]);
  });

  it("should be able to fetch paginated physicaldocuments history", async () => {
    for (let i = 1; i <= 45; i++) {
      await inMemoryPhysicalDocumentRepository.create(makePhysicalDocument());
    }

    const result = await sut.execute({
      page: 2,
    });
    if (result.isRight()) expect(result.value.physicaldocuments).toHaveLength(5);
  });
  
  it("should be able to fetch physicaldocuments history by project", async () => {
    const newPhysicalDocument1 = makePhysicalDocument({
      projectId: new UniqueEntityID("projeto-1")
    });
    const newPhysicalDocument2 = makePhysicalDocument({
      projectId: new UniqueEntityID("projeto-1")
    });
    const newPhysicalDocument3 = makePhysicalDocument({
      projectId: new UniqueEntityID("projeto-2")
    });

    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument1);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument2);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument3);

    const result = await sut.execute({
      page: 1,
      projectId: "projeto-1"
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.physicaldocuments).toHaveLength(2)
  });

  it("should be able to fetch physicaldocuments history by identifier", async () => {
    const newPhysicalDocument1 = makePhysicalDocument({
      unitized: false,
      identifier:10
    });
    const newPhysicalDocument2 = makePhysicalDocument({
      unitized: false,
      identifier: 5
    });
    const newPhysicalDocument3 = makePhysicalDocument({
      unitized: true,
      identifier: 10
    });

    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument1);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument2);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument3);

    const result = await sut.execute({
      page: 1,
      identifier: 10
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.physicaldocuments).toHaveLength(2)
  });
});
