export class City {
    istat: number;
    comune: string;
    lng: number;
    lat: number;

    constructor(istat: number, comune: string, lng: number, lat: number) {
        this.istat = istat;
        this.comune = comune;
        this.lng = lng;
        this.lat = lat;
    }

    toString(): string {
        return this.comune + '';
    }
}
