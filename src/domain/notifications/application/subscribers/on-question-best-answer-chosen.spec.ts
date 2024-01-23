import { makeAnswer } from "@/tests/factories/make-answer";
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
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";

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

describe("on question best answer choosen", () => {
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

  it("should send a notification when question has new best answer chosen", async () => {
    const _onQuestionBestAnswerChosen = new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotifcationUseCase,
    );

    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionsRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
