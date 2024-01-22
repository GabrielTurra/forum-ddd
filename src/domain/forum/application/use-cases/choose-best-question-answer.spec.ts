import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { makeAnswer } from "@/tests/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "@/tests/repositories/in-memory-questions-repository";
import { ChooseBestQuestionAnswerUseCase } from "./choose-best-question-answer";
import { makeQuestion } from "@/tests/factories/make-question";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "@/tests/repositories/in-memory-question-attachments-repository";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answers-attachments-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: ChooseBestQuestionAnswerUseCase;

describe("Choose Best Question Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new ChooseBestQuestionAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    );
  });

  it("should be able to choose the question best answer", async () => {
    const question = makeQuestion();

    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    });

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to choose another user question best answer ", async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });

    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    });

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
