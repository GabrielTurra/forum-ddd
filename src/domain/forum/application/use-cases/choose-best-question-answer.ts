import { Question } from "@/domain/forum/enterprise/entities/question";
import { AnswersRepository } from "./../repositories/answers-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";

interface ChooseBestQuestionAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChooseBestQuestionAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { question: Question }
>;

export class ChooseBestQuestionAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseBestQuestionAnswerUseCaseRequest): Promise<ChooseBestQuestionAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionRepository.findById(answer.questionId.toString());

    if (authorId !== question?.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({
      question,
    });
  }
}
