import {IsEmail, IsNotEmpty, IsInt, Min, IsDate} from 'class-validator'


export class Dto {
    @IsNotEmpty()
    nome:string;

    @IsDate()
    idade: number;

    @IsEmail()
    email:string




}
