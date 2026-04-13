<script lang="ts">
    import type { Settlement } from "$lib/settlement";
    import type { PageProps } from "./$types";
    import { mount, onMount, unmount } from "svelte";
    import { MapLibre, Marker, Popup, type StyleSpecification } from "svelte-maplibre";

    let { data }: PageProps = $props();
    const SETTLEMENTS = data.settlements;

    const SATELLITE_STYLE: StyleSpecification = {
        version: 8,
        sources: {
            satellite: {
                type: "raster",
                tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"],
                tileSize: 256,
                attribution: "Sentinel-2 cloudless via EOX",
            },
        },
        layers: [
            {
                id: "satellite",
                type: "raster",
                source: "satellite",
            },
        ],
    };
</script>

<svelte:head>
    <title>Map of Prehistoric Towns and Cities</title>
    <link rel="preload" href="/settlements.json" as="fetch" type="application/json" />
</svelte:head>

<MapLibre center={[34, 34]} zoom={3} class="map" standardControls style={SATELLITE_STYLE} projection={{ type: "globe" }}>
    {#each SETTLEMENTS as { name, inhabitation, location, wikipediaURL }}
        <Marker class="settlement-marker" lngLat={{ lat: location.latitude, lng: location.longitude }} anchor="top-left">
            <a href={wikipediaURL} target="_blank">
                <div class="location-circle"></div>
                <p class="label">{name}</p>
            </a>
            <Popup openOn="hover" offset={[6, 0]} closeButton={true}>
                <p>start: {inhabitation.start}</p>
            </Popup>
        </Marker>
    {/each}
</MapLibre>

<style>
    :global(body),
    :global(html) {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: black;
    }

    :global(.map) {
        height: 100%;
        width: 100%;
    }

    :global(.settlement-marker) {
        display: inline-flex;
        align-items: top;
        height: 1rem;

        a {
            display: inline-flex;
            align-items: top;
            cursor: pointer;
            text-decoration: none;

            .location-circle {
                width: 0.5rem;
                height: 0.5rem;
                margin-right: 0.125rem;
                border: 0.125rem solid white;
                border-radius: 50%;
                background: black;
                box-shadow: 0 0.0625rem 0.1875rem rgb(0 0 0 / 55%);
            }

            .label {
                color: black;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 1rem;
                font-weight: bold;
                text-shadow:
                    -1px -1px 0 white,
                    1px -1px 0 white,
                    -1px 1px 0 white,
                    1px 1px 0 white;
                white-space: nowrap;
                margin: 0;
            }
        }
    }
</style>
