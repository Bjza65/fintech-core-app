import { InvalidPropValueError } from "../exceptions/DomainError";

export interface UserProps {
    id?: string;
    email: string;
    passwordHash: string;
    fullName: string;
    createdAt: Date;
};

export class User {
    private readonly props: UserProps;

    private constructor(props: UserProps){
        this.props = props;
    }

    public static create(props: UserProps): User {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/; // validación de correo con estructura de correo
        if (!emailRegex.test(props.email)){
            throw new InvalidPropValueError(`El formato del correo electronico es invalido: ${props.email}`);
        }

        const fullNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
        if(!fullNameRegex.test(props.fullName)){
            throw new InvalidPropValueError(`El formato del nombre no es valido: ${props.fullName}`);
        }

        const passwordHashRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordHashRegex.test(props.passwordHash)){
            throw new InvalidPropValueError(`El formato de la contraseña no es valido, al menos debe tener: 8 carecteres, una mayuscula, una minuscula, un numero y un simbolo`)
        }
        
        //creamos una regla para validar id?

        return new User(props);
    }

    //Getters

    get id(): string | undefined {return this.props.id;}
    get email(): string {return this.props.email;}
    get passwordHash(): string {return this.props.passwordHash;}
    get fullName(): string {return this.props.fullName;}
    get createdAt(): Date {return this.props.createdAt;}

    set id(value: string) {this.props.id = value;} //user.id = "Hola";
}