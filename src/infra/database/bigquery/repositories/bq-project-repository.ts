import { Injectable } from "@nestjs/common";
import { ProjectRepository } from "src/domain/material-movimentation/application/repositories/project-repository";
import { Project } from "src/domain/material-movimentation/enterprise/entities/project";
import { BigQueryService } from "../bigquery.service";
import { BqProjectMapper } from "../mappers/bq-project-mapper";

@Injectable()
export class BqProjectRepository implements ProjectRepository {
  constructor(private bigquery: BigQueryService) {}

  async findByProjectNumber(
    project_number: string,
    baseId: string
  ): Promise<Project | null> {
    const [project] = await this.bigquery.project.select({
      like: { project_number },
      where: { baseId },
    });

    if (!project) return null;

    return BqProjectMapper.toDomin(project);
  }

  async findByID(id: string): Promise<Project | null> {
    const [project] = await this.bigquery.project.select({
      where: { id },
    });

    if (!project) return null;

    return BqProjectMapper.toDomin(project);
  }

  async findByIds(ids: string[]): Promise<Project[]> {
    const projects = await this.bigquery.project.select({
      whereIn: { id: ids },
    });

    return projects.map(BqProjectMapper.toDomin);
  }

  async create(project: Project): Promise<void> {
    const data = BqProjectMapper.toBigquery(project);

    await this.bigquery.project.create([data]);
  }
}
