export class User {
    private _id: number;
    firstName: string;
    secondName: string;
    email: string;
    password: string;
    province: string;
    role: string;


    constructor(firstName: string, secondName: string, email: string, password: string, province: string, role: string) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.email = email;
        this.password = password;
        this.province = province;
        this.role = role;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }
}
