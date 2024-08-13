import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'CustomMatchPassword', async: false })
export class CustomMatchPassword implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        if (password !== (args.object as any)[args.constraints[0]]) return false;
        return true;
    }
    
    defaultMessage(_args: ValidationArguments) {
        return `confirm password don't match`;
    }
}