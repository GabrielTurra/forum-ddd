import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { InMemoryQuestionCommentsRepository } from "@/tests/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "@/tests/factories/make-question-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;

let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID("author-1"),
    });

    inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      authorId: "author-1",
      questionCommentId: questionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a another user question comment", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID("author-1"),
    });

    inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      authorId: "author-2",
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
  });
});
