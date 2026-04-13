import type { Settlement } from '$lib/settlement';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/settlements.json');

    return {
        settlements: (await response.json()) as Settlement[],
    };
};
