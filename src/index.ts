import maplibregl from "maplibre-gl";
import type { Settlement } from "./settlement";

class SettlementMarker extends maplibregl.Marker {
    private popup: maplibregl.Popup;

    constructor(settlement: Settlement, map: maplibregl.Map) {
        const settlementMarkerElement = document.createElement("a") as HTMLAnchorElement;
        settlementMarkerElement.className = "settlement-marker";
        settlementMarkerElement.title = settlement.name;
        settlementMarkerElement.href = settlement.wikipediaURL;
        settlementMarkerElement.target = "_blank";

        const dot = document.createElement("div");
        dot.className = "location-circle";

        const label = document.createElement("p");
        label.className = "label";
        label.textContent = settlement.name;

        settlementMarkerElement.append(dot, label);

        super({
            anchor: "left",
            element: settlementMarkerElement,
            opacityWhenCovered: "0"
        });


        this.setLngLat({
            lng: settlement.location.longitude,
            lat: settlement.location.latitude
        });
        this.addTo(map);

        // Create popup that appears on hover
        this.popup = new maplibregl.Popup()
            .setText("example");

        // Add hover event listeners
        settlementMarkerElement.addEventListener("mouseenter", () => {
            this.popup.setLngLat(this.getLngLat()).addTo(map);
        });

        settlementMarkerElement.addEventListener("mouseleave", () => {
            this.popup.remove();
        });
    }
}

const map = new maplibregl.Map({
    container: "map",
    center: [0, 20],
    zoom: 1.6,
    pitch: 0,
    bearing: 0,
    attributionControl: { compact: true },
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

const settlements: Settlement[] = await (await fetch("settlements.json")).json();

const markers = new Map<Settlement, maplibregl.Marker>();

for (const settlement of settlements) {
    console.log(settlement.name, settlement.location.longitude, settlement.location.latitude);
    const marker = new SettlementMarker(settlement, map)
        .addTo(map);

    markers.set(settlement, marker);
}
