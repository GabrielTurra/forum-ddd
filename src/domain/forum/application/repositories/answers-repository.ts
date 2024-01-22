import { PaginationParams } from "@/core/types/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  save(question: Answer): Promise<void>;
  delete(question: Answer): Promise<void>;
  findById(questionId: string): Promise<Answer | null>;
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>;
}
