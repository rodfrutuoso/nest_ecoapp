import { beforeEach, describe, expect, it } from "vitest";
import { FetchPhysicalDocumentUseCase } from "./fetch-physical-document";
import { InMemoryPhysicalDocumentRepository } from "../../../../../../test/repositories/in-memory-physical-document-repository";
import { makePhysicalDocument } from "../../../../../../test/factories/make-physical-document";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { InMemoryProjectRepository } from "test/repositories/in-memory-project-repository";
import { makeProject } from "test/factories/make-project";

let inMemoryProjectRepository: InMemoryProjectRepository;
let inMemoryPhysicalDocumentRepository: InMemoryPhysicalDocumentRepository;
let sut: FetchPhysicalDocumentUseCase;

describe("Fetch PhysicalDocuments History", () => {
  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryPhysicalDocumentRepository = new InMemoryPhysicalDocumentRepository(
      inMemoryProjectRepository
    );
    sut = new FetchPhysicalDocumentUseCase(inMemoryPhysicalDocumentRepository);
  });

  it("should be able to fetch physical documents history sorting by identifier", async () => {
    const project = await makeProject();
    inMemoryProjectRepository.create(project);

    const newPhysicalDocument1 = makePhysicalDocument({
      identifier: 3,
      projectId: project.id,
    });
    const newPhysicalDocument2 = makePhysicalDocument({
      identifier: 10,
      projectId: project.id,
    });
    const newPhysicalDocument3 = makePhysicalDocument({
      identifier: 1,
      projectId: project.id,
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
    const project = await makeProject();
    inMemoryProjectRepository.create(project);

    for (let i = 1; i <= 45; i++) {
      await inMemoryPhysicalDocumentRepository.create(
        makePhysicalDocument({ projectId: project.id })
      );
    }

    const result = await sut.execute({
      page: 2,
    });
    if (result.isRight())
      expect(result.value.physicaldocuments).toHaveLength(5);
  });

  it("should be able to fetch physicaldocuments history by project", async () => {
    const project1 = await makeProject();
    inMemoryProjectRepository.create(project1);

    const project2 = await makeProject();
    inMemoryProjectRepository.create(project2);

    const newPhysicalDocument1 = makePhysicalDocument({
      projectId: project1.id,
    });
    const newPhysicalDocument2 = makePhysicalDocument({
      projectId: project1.id,
    });
    const newPhysicalDocument3 = makePhysicalDocument({
      projectId: project2.id,
    });

    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument1);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument2);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument3);

    const result = await sut.execute({
      page: 1,
      projectId: project1.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.physicaldocuments).toHaveLength(2);
  });

  it("should be able to fetch physicaldocuments history by identifier", async () => {
    const project = await makeProject();
    inMemoryProjectRepository.create(project);

    const newPhysicalDocument1 = makePhysicalDocument({
      unitized: false,
      identifier: 10,
      projectId: project.id,
    });
    const newPhysicalDocument2 = makePhysicalDocument({
      unitized: false,
      identifier: 5,
      projectId: project.id,
    });
    const newPhysicalDocument3 = makePhysicalDocument({
      unitized: true,
      identifier: 10,
      projectId: project.id,
    });

    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument1);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument2);
    await inMemoryPhysicalDocumentRepository.create(newPhysicalDocument3);

    const result = await sut.execute({
      page: 1,
      identifier: 10,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.physicaldocuments).toHaveLength(2);
  });
});
