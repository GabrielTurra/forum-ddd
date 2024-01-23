import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotifcationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerId.toString());

    if (answer) {
      await this.sendNotifcationUseCase.execute({
        recipientId: answer?.authorId.toString(),
        title: "Your answer was chosen as the best!",
        content: `${answer.excerpt.substring(0, 80).concat("...")}`,
      });
    }
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }
}
