import { ErrorUseCase } from "@/core/types/error";

export class NotAllowedError extends Error implements ErrorUseCase {
  constructor() {
    super("Not Allowed.");
  }
}
