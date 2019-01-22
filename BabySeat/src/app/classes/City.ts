export class City {
    Istat: string;
    Comune: string;
    Provincia: string;
    Regione: string;
    Prefisso: string;
    CAP: number;
    CodFisco: string;
    Abitanti: number;
    Link: string;

    constructor(Istat: string, Comune: string, Provincia: string,
                Regione: string, Prefisso: string, CAP: number, CodFisco: string,
                Abitanti: number, Link: string) {
        this.Istat = Istat;
        this.Comune = Comune;
        this.Provincia = Provincia;
        this.Regione = Regione;
        this.Prefisso = Prefisso;
        this.CAP = CAP;
        this.CodFisco = CodFisco;
        this.Abitanti = Abitanti;
        this.Link = Link;
    }
}
