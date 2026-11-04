"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const DomainError_1 = require("../exceptions/DomainError");
;
class User {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/; // validación de correo con estructura de correo
        if (!emailRegex.test(props.email)) {
            throw new DomainError_1.InvalidPropValueError(`El formato del correo electronico es invalido: ${props.email}`);
        }
        const fullNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
        if (!fullNameRegex.test(props.fullName)) {
            throw new DomainError_1.InvalidPropValueError(`El formato del nombre no es valido: ${props.fullName}`);
        }
        const passwordHashRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordHashRegex.test(props.passwordHash)) {
            throw new DomainError_1.InvalidPropValueError(`El formato de la contraseña no es valido, al menos debe tener: 8 carecteres, una mayuscula, una minuscula, un numero y un simbolo`);
        }
        //creamos una regla para validar id?
        return new User(props);
    }
    //Getters
    get id() { return this.props.id; }
    get email() { return this.props.email; }
    get passwordHash() { return this.props.passwordHash; }
    get fullName() { return this.props.fullName; }
    get createdAt() { return this.props.createdAt; }
    set id(value) { this.props.id = value; } //user.id = "Hola";
}
exports.User = User;
