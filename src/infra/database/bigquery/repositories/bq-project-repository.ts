import { Injectable } from "@nestjs/common";
import { ProjectRepository } from "src/domain/material-movimentation/application/repositories/project-repository";
import { Project } from "src/domain/material-movimentation/enterprise/entities/project";

@Injectable()
export class BqProjectRepository implements ProjectRepository {
  findByProjectNumber(project_number: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
  findByID(id: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
  create(project: Project): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
