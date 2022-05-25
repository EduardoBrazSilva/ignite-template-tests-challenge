import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { StatementOperationTransferDTO } from "./StatementOperationTransferDTO";


@injectable()
class StatementOperationTransferUseCase {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

  ) {}
  async execute({ senderIdUser, receiverIdUser, amount, description }: StatementOperationTransferDTO) {
    const sender = await this.usersRepository.findById(senderIdUser)
    if (!sender) {
      throw new AppError('Sender user not found')
    }

    const receiver = await this.usersRepository.findById(receiverIdUser)
    if (!receiver) {
      throw new AppError('Sender user not found')
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: senderIdUser });
    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      user_id: senderIdUser
    });
  }
}

export { StatementOperationTransferUseCase };
