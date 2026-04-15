<script lang="ts">
    import { mount, onMount, unmount } from "svelte";
    import { MapLibre, Marker, Popup, type StyleSpecification } from "svelte-maplibre";
    import type { PageProps } from "./$types";
    import { OWN_SETTLEMENTS_PATH_SUFFIX, PLEIADES_SETTLEMENTS_PATH_SUFFIX } from "$lib/const";

    let { data }: PageProps = $props();

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

    let year = $state(-10000);
    let yearSlider = $state(true);
    
    // omit pleiades settlementes for now
    // const settlements = data.pleiadesSettlements.concat(data.ownSettlements);
    const settlements = data.ownSettlements;
</script>

<svelte:head>
    <title>Map of Prehistoric Towns and Cities</title>
    <link rel="preload" href={PLEIADES_SETTLEMENTS_PATH_SUFFIX} as="fetch" type="application/json" />
    <link rel="preload" href={OWN_SETTLEMENTS_PATH_SUFFIX} as="fetch" type="application/json" />
</svelte:head>

<div id="slider-container">
    <p>Year Slider</p>
    <input bind:checked={yearSlider} type="checkbox" id="show-year-slider" />
    {#if yearSlider}
        <p>{year}</p>
        <input bind:value={year} id="year-slider" type="range" min="-15000" max="-1000" step="100" />
    {/if}
</div>

<MapLibre center={[34, 34]} zoom={3} class="map" standardControls style={SATELLITE_STYLE} projection={{ type: "globe" }}>
    {#each settlements as { name, inhabitation, location, wikipediaURL, pleiadesURI, description }}
        {@const abandoned = inhabitation.end != null && inhabitation.end <= year}
        {#if yearSlider}
            {#if inhabitation.start <= year}
                <Marker class="settlement-marker {abandoned ? 'abandoned' : ''}" lngLat={{ lat: location.latitude, lng: location.longitude }} anchor="top-left">
                    <div class="location-circle"></div>
                    {#if !abandoned}
                        <p class="label">{name}</p>
                    {/if}
                    <Popup openOn="click" offset={[6, 0]} closeButton={true}>
                        <h3>{name}</h3>
                        <p>{description}</p>
                        <p>start: {inhabitation.start}</p>
                        {#if inhabitation.end}
                            <p>end: {inhabitation.end}</p>
                        {/if}
                        {#if wikipediaURL}
                            <a href={wikipediaURL} target="_blank">Wikipedia</a>
                        {/if}
                        {#if pleiadesURI}
                            <a href={pleiadesURI} target="_blank">Pleiades</a>
                        {/if}
                    </Popup>
                </Marker>
            {/if}
        {:else}
            <Marker class="settlement-marker" lngLat={{ lat: location.latitude, lng: location.longitude }} anchor="top-left">
                <div class="location-circle"></div>
                <p class="label">{name}</p>
                <Popup openOn="click" offset={[6, 0]} closeButton={true}>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <p>start: {inhabitation.start}</p>
                    {#if inhabitation.end}
                        <p>end: {inhabitation.end}</p>
                    {/if}
                    {#if wikipediaURL}
                        <a href={wikipediaURL} target="_blank">Wikipedia</a>
                    {/if}
                    <a href={pleiadesURI} target="_blank">Pleiades</a>
                </Popup>
            </Marker>
        {/if}
    {/each}
</MapLibre>

<style>
    :global(.maplibregl-popup) {
        p {
            margin: 0;
        }
    }
    :global(.settlement-marker.maplibregl-marker-covered) {
        display: none;
    }
    :global(body),
    :global(html) {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: black;
    }

    #slider-container {
        display: inline-flex;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        background-color: white;

        p {
            margin: 0;
        }

        #year-slider {
        }
    }

    :global(.map) {
        height: 100%;
        width: 100%;
    }

    :global(.settlement-marker) {
        height: 1rem;
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
            background-color: black;
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

    :global(.settlement-marker.abandoned) {
        a {
            .location-circle {
                background-color: grey;
            }
            .label {
                color: grey;
            }
        }
    }

    :global(.maplibregl-popup) {
        max-width: 20rem;
    }
</style>
