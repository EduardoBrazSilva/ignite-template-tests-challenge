import { Request, Response } from "express";
import { container } from "tsyringe";
import { StatementOperationTransferUseCase } from "./StatementOperationTransferUseCase";


class StatementOperationTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const sender_id = request.user.id;
    const { user_id }  = request.params;
    const { amount, description } = request.body;

    const statementOperationTransferUseCase = container.resolve(StatementOperationTransferUseCase);

    statementOperationTransferUseCase.execute({
      amount,
      description,
      senderIdUser: sender_id,
      receiverIdUser: user_id
    });


    return response.json({ Message: "Success"})
  }
}

export { StatementOperationTransferController };
