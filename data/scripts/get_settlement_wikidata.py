""" 
This script takes a Wikipedia URL of an ancient settlement as a command line argument, fetches the relevant Wikidata from the Wikimedia and Wikidata REST API and outputs the it to stdout as JSON according to the `Settlement` type. 
"""

import sys
import json
from urllib.parse import parse_qs, quote, unquote, urlparse
from termcolor import colored

import requests

HEADERS = {
    "User-Agent": "A script to manually fetch wikipedia about ancient settlements."}

# https://en.wikipedia.org/wiki/Special:RestSandbox/wmf-restbase
WIKIMEDIA_REST_API_BASE = "https://en.wikipedia.org/api/rest_v1"
# https://doc.wikimedia.org/Wikibase/master/js/rest-api
WIKIBASE_REST_API_BASE = "https://www.wikidata.org/w/rest.php/wikibase/v1"

# Wikidata properties that can potentially contain data for the inhabitation period of a settlement order by preference.
inhabitation_wikidata_properties = {
    "start": [
        "P571",  # inception https://www.wikidata.org/wiki/Property:P571
        "P580"  # start time https://www.wikidata.org/wiki/Property:P580
    ],
    "end": [
        "P576",  # dissolved, abolished or demolished date https://www.wikidata.org/wiki/Property:P576
        "P582"  # end time https://www.wikidata.org/wiki/Property:P582
    ]
}


def negative_date_to_year(date: str):
    if date.startswith("-"):
        return "-"+date.split("-")[1]
    else:
        return date.split("-")[0]


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(f"Usage: {sys.argv[0]} WIKIPEDIA_URL")

    wikipediaURL = sys.argv[1]
    uri_encoded_slug = wikipediaURL.split("/")[-1]

    wikipedia_info = requests.get(
        url=f"{WIKIMEDIA_REST_API_BASE}/page/summary/{uri_encoded_slug}",
        headers=HEADERS
    ).json()

    wikidata_item_id = wikipedia_info["wikibase_item"]

    settlement = {
        "wikipediaURL": wikipediaURL,
        "name": wikipedia_info["title"],
        "description": wikipedia_info["extract"],
        "location": {
            "latitude": wikipedia_info["coordinates"]["lat"],
            "longitude": wikipedia_info["coordinates"]["lon"]
        },
        "inhabitation": {
            "start": "",
            "end": "",
            "__start_from_wikidata": False,
            "__end_from_wikidata": False
        }
    }

    wikidata_item_statements = requests.get(
        url=f"{WIKIBASE_REST_API_BASE}/entities/items/{wikidata_item_id}/statements",
        headers=HEADERS
    ).json()

    # print(wikidata_item_statements)

    found_inhabitation_start = False
    for p in inhabitation_wikidata_properties["start"]:
        if p in wikidata_item_statements:
            found_inhabitation_start = True
            start_year = negative_date_to_year(
                wikidata_item_statements[p][0]["value"]["content"]["time"])
            print(
                "Using",
                colored(f"{p} @ {start_year}", attrs=["bold"]),
                "as inhabitation start.",
                file=sys.stderr
            )
            settlement["inhabitation"]["start"] = int(start_year)
            settlement["inhabitation"]["__start_from_wikidata"] = True
            break

    if not found_inhabitation_start:
        print("No property found to use for inhabitation start.")

    found_inhabitation_end = False
    for p in inhabitation_wikidata_properties["end"]:
        if p in wikidata_item_statements:
            found_inhabitation_end = True
            end_year = negative_date_to_year(
                wikidata_item_statements[p][0]["value"]["content"]["time"])
            print(
                "Using",
                colored(f"{p} @ {end_year}", attrs=["bold"]),
                "as inhabitation end.",
                file=sys.stderr
            )
            settlement["inhabitation"]["end"] = int(end_year)
            settlement["inhabitation"]["__end_from_wikidata"] = True
            break

    if not found_inhabitation_end:
        print("No property found to use for inhabitation end.")

    if (not found_inhabitation_start) or (not found_inhabitation_end):
        print("Look at properties?",
              f"{WIKIBASE_REST_API_BASE}/entities/items/{wikidata_item_id}/statements")

    print()
    print(json.dumps(settlement, indent=4))

    # print(json.dumps(settlement_from_wikipedia_url(sys.argv[1]), ensure_ascii=False, indent=4))
