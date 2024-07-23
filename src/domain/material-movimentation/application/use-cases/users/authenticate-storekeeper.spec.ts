import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateStorekeeperUseCase } from "./authenticate-storekeeper";
import { makeStorekeeper } from "test/factories/make-storekeeper";
import { WrogCredentialsError } from "../errors/wrong-credentials";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStorekeeperUseCase;

describe("authenticate storekeeper", () => {
  beforeEach(() => {
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStorekeeperUseCase(
      inMemoryStorekeeperRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("Sould be able to authenticate a storekeeper", async () => {
    const storekeeper = makeStorekeeper({
      email: "rodrigo@ecoeletrica.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      email: "rodrigo@ecoeletrica.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it("Sould not be able to authenticate a storekeeper with wrong password", async () => {
    const storekeeper = makeStorekeeper({
      email: "rodrigo@ecoeletrica.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      email: "rodrigo@ecoeletrica.com",
      password: "12345",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrogCredentialsError);
  });
});
