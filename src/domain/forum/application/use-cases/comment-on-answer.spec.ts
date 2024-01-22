import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { makeAnswer } from "@/tests/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "@/tests/repositories/in-memory-answer-comments-repository";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answers-attachments-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

let sut: CommentOnAnswerUseCase;

describe("Comment on answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository);
  });

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer();

    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: "author-1",
      content: "comment-1",
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual("comment-1");
  });
});
