import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotifcationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId.toString());

    if (question) {
      await this.sendNotifcationUseCase.execute({
        recipientId: question?.authorId.toString(),
        title: `New answer in ${question.title.substring(0, 40).concat("...")}`,
        content: `${answer.excerpt.substring(0, 80).concat("...")}`,
      });
    }
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name);
  }
}