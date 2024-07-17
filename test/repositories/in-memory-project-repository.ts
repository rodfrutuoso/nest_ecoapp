import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import { ProjectRepository } from "../../src/domain/material-movimentation/application/repositories/project-repository";
import { Project } from "../../src/domain/material-movimentation/enterprise/entities/project";

export class InMemoryProjectRepository implements ProjectRepository {
  public items: Project[] = [];

  async findByProjectNumber(project_number: string): Promise<Project | null> {
    const project = this.items.find(
      (item) => item.project_number === project_number
    );

    if (!project) return null;

    return project;
  }
  
  async findByID(id: string): Promise<Project | null> {
    const project = this.items.find((item) => item.id.toString() === id);

    if (!project) return null;

    return project;
  }

  async create(project: Project) {
    this.items.push(project);
  }
}
