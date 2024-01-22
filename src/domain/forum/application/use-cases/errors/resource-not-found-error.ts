import { ErrorUseCase } from "@/core/types/error";

export class ResourceNotFoundError extends Error implements ErrorUseCase {
  constructor() {
    super("Resource not found.");
  }
}
