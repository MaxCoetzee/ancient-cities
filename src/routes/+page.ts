import { OWN_SETTLEMENTS_PATH_SUFFIX, PLEIADES_SETTLEMENTS_PATH_SUFFIX } from '$lib/const';
import type { Settlement } from '$lib/settlement';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const [pleiadesResponse, ownResponse] = await Promise.all([
        fetch(PLEIADES_SETTLEMENTS_PATH_SUFFIX),
        fetch(OWN_SETTLEMENTS_PATH_SUFFIX)
    ]);

    return {
        pleiadesSettlements: (await pleiadesResponse.json()) as Settlement[],
        ownSettlements: (await ownResponse.json()) as Settlement[]
    };
};
