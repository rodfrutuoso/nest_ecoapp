import { Eihter, left, right } from "../../../../../core/either";
import { Material } from "../../../enterprise/entities/material";
import { MaterialRepository } from "../../repositories/material-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchMaterialUseCaseRequest {
  page: number;
  type?: string;
  contractId: string;
}

type FetchMaterialUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    materials: Material[];
  }
>;

export class FetchMaterialUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute({
    page,
    type,
    contractId,
  }: FetchMaterialUseCaseRequest): Promise<FetchMaterialUseCaseResponse> {
    const materials = await this.materialRepository.findMany(
      {
        page,
      },
      contractId,
      type
    );

    if (!materials.length) return left(new ResourceNotFoundError());

    return right({ materials });
  }
}
