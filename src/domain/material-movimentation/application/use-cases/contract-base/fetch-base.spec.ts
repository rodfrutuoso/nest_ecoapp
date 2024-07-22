import { beforeEach, describe, expect, it } from "vitest";
import { FetchBaseUseCase } from "./fetch-base";
import { InMemoryBaseRepository } from "../../../../../../test/repositories/in-memory-base-repository";
import { makeBase } from "../../../../../../test/factories/make-base";

let inMemoryBaseRepository: InMemoryBaseRepository;
let sut: FetchBaseUseCase;

describe("Fetch Bases History", () => {
  beforeEach(() => {
    inMemoryBaseRepository = new InMemoryBaseRepository();
    sut = new FetchBaseUseCase(inMemoryBaseRepository);
  });

  it("should be able to fetch physical documents history sorting by baseName", async () => {
    const newBase1 = makeBase({
      baseName: "Conquista",
    });
    const newBase2 = makeBase({
      baseName: "Petrolina",
    });
    const newBase3 = makeBase({
      baseName: "Itaberaba",
    });

    await inMemoryBaseRepository.create(newBase1);
    await inMemoryBaseRepository.create(newBase2);
    await inMemoryBaseRepository.create(newBase3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.bases).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({ baseName: "Conquista" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ baseName: "Itaberaba" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ baseName: "Petrolina" }),
        }),
      ]);
  });

  it("should be able to fetch paginated bases", async () => {
    for (let i = 1; i <= 45; i++) {
      await inMemoryBaseRepository.create(makeBase());
    }

    const result = await sut.execute({
      page: 2,
    });
    if (result.isRight()) expect(result.value.bases).toHaveLength(5);
  });
});
