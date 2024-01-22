import { InMemoryQuestionsRepository } from "@/tests/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { makeQuestion } from "@/tests/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "@/tests/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionAttachmentsRepository } from "@/tests/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

let sut: CommentOnQuestionUseCase;

describe("Comment on question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: "author-1",
      content: "comment-1",
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual("comment-1");
  });
});
