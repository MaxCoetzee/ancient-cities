/** A city or a town. Definition is still to be worked out, but will probably be quite lenient and fluent. */
interface City {
    /** The name of the city on English Wikipedia. */
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    /** The starting and ending date of occupation of the city/town. */
    occupation: {
        start: number;
        end: number;
    };
}