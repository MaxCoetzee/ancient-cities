/** Something like a city or a town. Definition is still to be worked out, but will probably be quite lenient and fluent. A good start: "Densely" popuated areas that are inhabited year-round. "Densely" simply means that houses are close to one another and not scattered throughout a landscape. */
export interface Settlement {
    /** The name of the settlement on English Wikipedia. */
    name: string;
    /** URL to the Wikipedia page of the settlement. */
    wikipediaURL?: string;
    /** The location of the settlement according to Wikipedia. */
    location: {
        latitude: number;
        longitude: number;
    };
    /** The starting and ending date of inhabitation of the settlement. -1000 is equal to 1000 BCE and 1000 is equal to 1000 CE. */
    inhabitation: {
        start: number;
        end?: number;
        /** Temporary property to mark that the start date exists on and was retrieved from Wikidata, in case they will be added to Wikidata at a later point. */
        __start_from_wikidata: boolean;
        /** Temporary property to mark that the end date exists on and was retrieved from Wikidata, in case they will be added to Wikidata at a later point. */
        __end_from_wikidata: boolean;
    };
    /** Estimated maximum population. */
    maxPopulation?: number;
    /** A brief 1-2 sentences description of the settlement along with its relevance and context. */
    description?: string;
    /** Data entered from own sources doesn't have a pleiadesURI. */
    pleiadesURI?: string;
}