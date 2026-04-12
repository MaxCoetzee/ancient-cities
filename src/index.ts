import maplibregl from "maplibre-gl";

const map = new maplibregl.Map({
    container: "map",
    center: [0, 20],
    zoom: 1.6,
    pitch: 0,
    bearing: 0,
    attributionControl: true,
    style: {
        version: 8,
        sources: {
            satellite: {
                type: "raster",
                tiles: [
                    "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"
                ],
                tileSize: 256,
                attribution: "Sentinel-2 cloudless via EOX"
            }
        },
        layers: [
            {
                id: "satellite",
                type: "raster",
                source: "satellite"
            }
        ]
    }
});

map.on("style.load", () => {
    map.setProjection({
        type: "globe"
    });
});

map.addControl(new maplibregl.NavigationControl(), "top-right");