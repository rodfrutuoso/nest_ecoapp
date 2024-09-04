import { Module } from "@nestjs/common";
import { FetchAccountsQueryDto } from "./material-movimentation/users/dto classes/fetch-accounts.dto";
import { EditAccountBodyDto } from "./material-movimentation/users/dto classes/edit-account.dto";
import { CreateAccountBodyDto } from "./material-movimentation/users/dto classes/create-account.dto";
import { AuthenticateBodyDto } from "./material-movimentation/users/dto classes/authenticate.dto";

@Module({
  providers: [
    FetchAccountsQueryDto,
    EditAccountBodyDto,
    CreateAccountBodyDto,
    AuthenticateBodyDto,
  ],
  exports: [
    FetchAccountsQueryDto,
    EditAccountBodyDto,
    CreateAccountBodyDto,
    AuthenticateBodyDto,
  ],
})
export class DtoModule {}
