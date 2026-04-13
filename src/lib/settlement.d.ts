/** Something like a city or a town. Definition is still to be worked out, but will probably be quite lenient and fluent. A good start: "Densely" popuated areas that are inhabited year-round. "Densely" simply means that houses are close to one another and not scattered throughout a landscape. */
export interface Settlement {
    /** The name of the settlement on English Wikipedia. */
    name: string;
    /** URL to the Wikipedia page of the settlement. */
    wikipediaURL: string;
    /** The location of the settlement according to Wikipedia. */
    location: {
        latitude: number;
        longitude: number;
    };
    /** The starting and ending date of inhabitation of the settlement in [astronomical year numbering](https://en.wikipedia.org/wiki/Astronomical_year_numbering). */
    inhabitation: {
        start: number;
        end?: number;
    };
    /** Estimated maximum population. */
    maxPopulation?: number;
}