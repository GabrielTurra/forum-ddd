import { makeAnswer } from "@/tests/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answers-attachments-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryQuestionsRepository } from "@/tests/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "@/tests/repositories/in-memory-question-attachments-repository";
import { InMemoryNotificationsRepository } from "@/tests/repositories/in-memory-notifications-repository";
import { makeQuestion } from "@/tests/factories/make-question";
import { SpyInstance, vi } from "vitest";
import { waitFor } from "@/tests/utils/wait-for";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

let sendNotifcationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("on answer created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotifcationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository);

    sendNotificationExecuteSpy = vi.spyOn(sendNotifcationUseCase, "execute");
  });

  it("should send a notification when a answer is created", async () => {
    const _onAnswerCreated = new OnAnswerCreated(
      inMemoryQuestionsRepository,
      sendNotifcationUseCase,
    );

    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
