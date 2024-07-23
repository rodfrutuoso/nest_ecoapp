import { HashComparer } from "src/domain/material-movimentation/application/cryptography/hash-comperer";
import { HashGenerator } from "src/domain/material-movimentation/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("-hashed") === hash;
  }
  async hash(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }
}
