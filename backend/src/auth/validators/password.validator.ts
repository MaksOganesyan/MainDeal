import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordValidator', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password) {
      return false;
    }

    const email = (args.object as any).email;
    const login = (args.object as any).login;

    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
      return false;
    }

    if (login && password.toLowerCase().includes(login.toLowerCase())) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'Password must not contain the email or login';
  }
}