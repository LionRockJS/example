import { IdentifierPassword as BaseIdentifierPassword } from '@lionrockjs/adapter-auth-password';
import { hashPassword, verifyPassword } from '../../helper/PasswordHash.ts';

export default class IdentifierPassword extends BaseIdentifierPassword {
  static async registerFilter(identifier: any, postData: any, state: any) {
    BaseIdentifierPassword.matchRetypePassword(postData.password, postData['retype-password']);
    const hash = await this.hash(identifier.user_id, identifier.name, postData.password, state);

    return {
      hash,
    };
  }

  static async loginFilter(identifier: any, postData: any, state: any) {
    const plainTextPassword = postData.password;
    if (await verifyPassword(identifier.hash, identifier.user_id, identifier.name, plainTextPassword, state) === false) {
      throw new Error('Password Mismatch');
    }

    return {};
  }

  static async hash(userId: string, identifierName: string, plainTextPassword: string, state?: Map<string, any>) {
    return hashPassword(userId, identifierName, plainTextPassword, state);
  }
}
