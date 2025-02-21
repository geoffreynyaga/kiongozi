/*
 * File: select.tsx
 * Project: kiongozi
 * File Created: Tuesday, 24th December 2024 10:23:58 am
 * Author: Geoffrey Nyaga (geoffreynyagagk@gmail.com)
 * -----
 * Last Modified: Tuesday, 24th December 2024 10:25:32 am
 * Modified By: Geoffrey Nyaga (geoffreynyagagk@gmail.com>)
 * -----
 * This file should not be copied and/or distributed without the express
 * permission of Geoffrey Nyaga Kinyua
 *
 * Copyright 2022 - 2024 Geoffrey Nyaga Kinyua
 */

"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import React, {useEffect, useState} from "react";

import {CONSTITUENCIES_DATA} from "./constituenciesData";
import {COUNTY_DATA} from "./county-data";
import {GeoJSON} from "react-leaflet";
import L from "leaflet";
import {MapContainer} from "react-leaflet/MapContainer";
import {TileLayer} from "react-leaflet/TileLayer";
import {useMap} from "react-leaflet/hooks";

interface ICounty {
    type: "Feature";
    properties: {
        OBJECTID: number;
        AREA: number;
        PERIMETER: number;
        COUNTY3_: number;
        COUNTY3_ID: number;
        COUNTY: string;
        Shape_Leng: number;
        Shape_Area: number;
    };
    geometry: {
        type: "MultiPolygon";
        coordinates: number[][][][];
    };
}

function CountySelect() {
    const [activePolygon, setActivePolygon] = useState("");
    const [counties, setCounties] = useState<ICounty[] | null>(null);
    const [constituencies, setConstituencies] = useState([]);
    const [wards, setWards] = useState([]);

    const [bounds, setBounds] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    const [selectedCounty, setSelectedCounty] = useState(null);
    const [selectedConstituency, setSelectedConstituency] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [selectedHome, setSelectedHome] = React.useState(false);

    const fetchConstituencies = async () => {
        console.log("getting constituencies data");

        let data = CONSTITUENCIES_DATA;
        setConstituencies(data.features);
        try {
            if (data.features.length > 0) {
                const mapBounds = L.geoJSON(data.features).getBounds();
                setBounds(mapBounds.isValid() ? mapBounds : null);
            }
        } catch {}

        fetch(`/api/applications/county/${activePolygon}/constituencies/boundaries/`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "constituencies data");
                setConstituencies(data.features);
            });
    };

    const fetchWards = async () => {
        fetch(`/api/accounts/constituencies/${activePolygon}/wards/boundaries/`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "ward data");
                setWards(data.features);
                try {
                    if (data.features.length > 0) {
                        const mapBounds = L.geoJSON(data.features).getBounds();
                        setBounds(mapBounds.isValid() ? mapBounds : null);
                    }
                } catch {}
            });
    };

    useEffect(() => {
        console.log("useffect to call counties");

        let data = COUNTY_DATA;

        if (counties === null || counties.length <= 0) {
            setCounties(data.features as ICounty[]);
            try {
                if (data.features.length > 0) {
                    const mapBounds = L.geoJSON(data.features).getBounds();
                    console.log(mapBounds, "mapBounds");
                    console.log(typeof mapBounds, "mapBounds");

                    let x = mapBounds.isValid() ? "valid" : "invalid";
                    console.log(x, "mapBounds is valid");

                    setBounds(mapBounds.isValid() ? mapBounds : null);
                }
            } catch (err) {
                console.log(err, "error");
            }
        }

        // setCounties(county_geojson);
    }, [counties]);

    const handlePolygonClick = (name) => {
        setActivePolygon(name);
    };
    // Custom MapComponent that fits the map within the bounds and disables panning beyond the bounds
    const FitBoundsMap = () => {
        const map = useMap();

        useEffect(() => {
            if (bounds && map) {
                map.fitBounds(bounds, {padding: [10, 10]});
            }
        }, [bounds, map]);

        return null;
    };

    const handleCountySelect = async (name) => {
        console.log(name, "name");

        console.log(selectedCounty, "selectedCounty");
        console.log(selectedConstituency, "selectedConstituency");
        console.log(selectedWard, "selectedWard");

        if (
            selectedCounty === null &&
            selectedConstituency === null &&
            selectedWard === null
        ) {
            console.log(`first`);
            setSelectedCounty(name);
            setSelectedConstituency(null);
            setSelectedWard(null);
            const data = await fetchConstituencies();
        } else if (
            selectedCounty &&
            selectedConstituency === null &&
            selectedWard === null
        ) {
            console.log(`second`);

            setSelectedConstituency(name);
            const data = await fetchWards();
        } else {
            console.log(`third`);

            setSelectedWard(name);
        }
    };

    const handleMapReady = (map) => {
        setMapInstance(map);
    };

    if (counties === null || counties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen">
                <p>Loading Counties</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full md:h-screen md:flex-row ">
            {!activePolygon ? (
                <div className="flex flex-col items-center justify-center w-full h-screen">
                    <button
                        onClick={() => {
                            setActivePolygon("start");
                        }}
                        className="px-12 py-4 text-2xl font-medium text-white bg-green-500 rounded shadow"
                    >
                        Start
                    </button>{" "}
                </div>
            ) : selectedWard && selectedHome === false ? (
                // <DrawStudentHomeBoundary
                //     wardName={selectedWard}
                //     setHome={setSelectedHome}
                // />

                <p>Draw</p>
            ) : selectedWard ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-pink-100 md:flex-row md:justify-between">
                    <div className="flex flex-col items-center justify-center w-full md:w-1/2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-center scroll-m-20 lg:text-5xl">
                            You are almost done...
                        </h1>

                        <p className="mt-8 mb-12 text-center">
                            Proceed below to share your profile information
                        </p>

                        <a
                            href={`/accounts/studentprofile/create/${selectedWard}/`}
                            className="relative items-center justify-center inline-block w-2/3 p-4 px-5 py-3 overflow-hidden font-medium bg-blue-500 rounded-lg shadow-2xl md:w-1/2 group"
                        >
                            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-red-500 rounded-full blur-md ease"></span>
                            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                                <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-500 rounded-full blur-md"></span>
                                <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-pink-500 rounded-full blur-md"></span>
                            </span>
                            <span className="relative font-bold text-black text-md">
                                Proceed To Profile{" "}
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full mt-8 md:w-1/2 md:mt-0">
                        <div className="w-2/3 shadow rounded-3xl shadow-3xl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                data-name="Layer 1"
                                // width='538.0218'
                                // height='520.24984'
                                viewBox="0 0 538.0218 520.24984"
                                className="w-full"
                            >
                                <path
                                    d="M821.82762,687.5884a2.80741,2.80741,0,0,1-2.03464-4.86593l.19237-.76476q-.038-.09189-.07644-.18358a7.53909,7.53909,0,0,0-13.90673.05167c-2.27452,5.4781-5.17038,10.96553-5.88341,16.75771a22.30362,22.30362,0,0,0,.39153,7.67061,89.41943,89.41943,0,0,1-8.13413-37.13874,86.307,86.307,0,0,1,.53535-9.6283q.44349-3.93128,1.23055-7.80653a90.45559,90.45559,0,0,1,17.93812-38.3373A24.07278,24.07278,0,0,0,822.092,602.9559a18.3625,18.3625,0,0,0,1.67-5.01791c-.48738.06393-1.83778-7.35909-1.47017-7.81452-.67924-1.03071-1.895-1.54307-2.63681-2.54885-3.68943-5.0021-8.77253-4.12872-11.42612,2.66876-5.6687,2.861-5.72357,7.60577-2.24528,12.16916,2.2129,2.90325,2.51695,6.83168,4.45862,9.93984-.19981.25572-.40756.50344-.6073.75916a91.04046,91.04046,0,0,0-9.50223,15.05378,37.84589,37.84589,0,0,0-2.25945-17.5787c-2.16269-5.21725-6.21632-9.61123-9.786-14.12153-4.2878-5.41757-13.08033-3.05324-13.83575,3.81439q-.011.09973-.02142.19941.79533.44867,1.55706.95247a3.808,3.808,0,0,1-1.53532,6.92992l-.07765.012a37.88961,37.88961,0,0,0,.99876,5.66515c-4.57949,17.71009,5.30731,24.16047,19.42432,24.45023.31163.15979.61531.31958.92694.47145a92.92537,92.92537,0,0,0-5.00193,23.5393,88.13663,88.13663,0,0,0,.06393,14.23066l-.024-.16777a23.28922,23.28922,0,0,0-7.95036-13.44764c-6.11822-5.02589-14.76211-6.87666-21.36259-10.9165a4.37072,4.37072,0,0,0-6.69422,4.252q.01327.0882.027.17642a25.5799,25.5799,0,0,1,2.86849,1.38225q.79532.44877,1.55706.95247a3.8081,3.8081,0,0,1-1.53533,6.93l-.07772.01193c-.05591.008-.10387.016-.15972.024a37.92271,37.92271,0,0,0,6.97545,10.92264c2.86344,15.46022,15.162,16.927,28.31753,12.42488h.008a92.89716,92.89716,0,0,0,6.24043,18.21781H821.269c.08-.24769.15184-.50341.22379-.75113a25.329,25.329,0,0,1-6.16856-.36745c1.654-2.02957,3.308-4.07513,4.962-6.10463a1.384,1.384,0,0,0,.10388-.11987c.839-1.03867,1.68595-2.06945,2.52491-3.10816l.00045-.00126a37.10118,37.10118,0,0,0-1.08711-9.45127Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#f2f2f2"
                                />
                                <path
                                    d="M784.68188,489.35329c5.90814-21.45223,16.9292-39.72273,34.72329-53.77843a4.89248,4.89248,0,0,1,6.75634-1.45469l40.61465,26.2238a4.89245,4.89245,0,0,1,1.45468,6.75632l-34.72329,53.77843a4.89246,4.89246,0,0,1-6.75632,1.45471l-40.61465-26.22379A4.89247,4.89247,0,0,1,784.68188,489.35329Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#f2f2f2"
                                />
                                <path
                                    d="M798.28516,475.12149c1.52248-11.3345,10.89894-22.92117,22.32328-34.57366a4.58185,4.58185,0,0,1,6.32752-1.36236l34.90487,22.53714a4.58206,4.58206,0,0,1,1.36257,6.32764l-30.899,47.85549a4.58205,4.58205,0,0,1-6.32771,1.36224l-21.62285-13.96129A20.40975,20.40975,0,0,1,798.28516,475.12149Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#fff"
                                />
                                <path
                                    d="M801.39977,521.3357c-5.15377-21.64585-4.29431-42.9657,4.53083-63.85372a4.89248,4.89248,0,0,1,5.22058-4.52878l48.22374,3.42179a4.89246,4.89246,0,0,1,4.52876,5.22056l-4.53084,63.85372a4.89247,4.89247,0,0,1-5.22054,4.5288l-48.22374-3.42179A4.89248,4.89248,0,0,1,801.39977,521.3357Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#f2f2f2"
                                />
                                <path
                                    d="M806.46733,502.31169c-4.12451-10.66664-1.48736-25.33683,2.91283-41.051a4.58187,4.58187,0,0,1,4.88923-4.24135l41.44424,2.94074a4.58205,4.58205,0,0,1,4.24158,4.88924l-4.03183,56.82112a4.582,4.582,0,0,1-4.88945,4.24133l-25.67385-1.82172A20.40974,20.40974,0,0,1,806.46733,502.31169Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#fff"
                                />
                                <path
                                    d="M805.558,387.709l-20.65947-76.46688A12.785,12.785,0,0,0,769.3901,302.229l0,0a12.785,12.785,0,0,0-9.02253,16.21244l23.89523,78.77245,12.50192,48.47714a11.15676,11.15676,0,1,0,14.30444.63831Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#ffb6b6"
                                />
                                <path
                                    d="M656.56436,400.93746l21.18655-76.32252a12.785,12.785,0,0,0-8.75169-15.65748l0,0a12.785,12.785,0,0,0-16.02429,9.35261l-19.57713,79.95509L619.454,446.34739a11.15677,11.15677,0,1,0,11.983,7.83792Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#ffb6b6"
                                />
                                <polygon
                                    points="446.816 504.239 433.315 504.238 426.893 452.165 446.818 452.166 446.816 504.239"
                                    fill="#ffb6b6"
                                />
                                <path
                                    d="M778.28,708.19791l-41.5155-.00158v-.525a16.15988,16.15988,0,0,1,16.159-16.15874h.001l7.58332-5.75307,14.14881,5.754,3.62405.00009Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#2f2e41"
                                />
                                <polygon
                                    points="351.81 504.375 338.519 502.004 341.337 449.611 360.953 453.11 351.81 504.375"
                                    fill="#ffb6b6"
                                />
                                <path
                                    d="M680.79465,708.19791,639.924,700.90914l.09215-.51682a16.15988,16.15988,0,0,1,18.74445-13.07148l.001.00018,8.47541-4.33265,12.91914,8.14819,3.56777.63621Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#2f2e41"
                                />
                                <path
                                    d="M684.1149,454.68878S671.533,472.51,672.04585,478.49051s4.95628,1.20962.51287,5.98048-7.03249,1.57014-4.84927,7.46428,3.07191,2.07745,2.18322,5.89414.88869,149.80512.88869,149.80512h23.13691s13.04781-84.65063,11.39607-88.60269-1.61387-2.23155.14456-6.43141,3.41329-9.19612,3.41329-9.19612l18.288-51.46886,14.107,72.46739L757.87262,650.515h22.17212s3.79668-126.62986,5.47535-128.20763-.32961-5.12377-2.43586-7.16746-1.6864-4.11877-1.00764-8.32918,3.54219-6.55872,3.4435-9.20125,6.12208-44.62614-3.65343-51.30535S684.1149,454.68878,684.1149,454.68878Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#2f2e41"
                                />
                                <path
                                    d="M761.47653,277.1745l-25.88066-6.70645L723.515,253.80572l-28.6905,3.527-6.10734,22.72759L668.29182,291.9164c36.61419.21884,16.89656,106.2934,22.27807,113.13715,4.37946,5.56948-21.85839,18.81883-13.63532,27.27064s5.18276,5.06989,3.27462,14.27147-15.81778,18.93956,0,18.84293,111.265-1.46016,108.538-12.36842-2.68412-8.13825-6.79619-14.97738-6.87956-3.01732-5.49582-13.10942-3.1106-17.89788.02026-22.3639c4.80557-6.85486-.03728-56.33733-4.56872-55.01654Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#6c63ff"
                                />
                                <path
                                    d="M754.08714,277.52823s18.9315-8.04275,25.74916,6.9561c2.17752,4.79055,4.011,16.82332,5.77769,14.155s.06211,3.18135,1.15575,3.18859c.97613.00645,2.47689-1.57243,1.34256,3.86689a10.77325,10.77325,0,0,0,3.14761,9.9166l-32.90372,19.70629Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#6c63ff"
                                />
                                <path
                                    d="M682.95747,291.16355s-18.93151-8.04275-25.74917,6.95611c-1.9174,4.21827-1.44033,13.5912-5.17412,12.53891s-1.08315,2.9125-1.57576,4.28986c-.54906,1.53518,1.848,5.87959-1.51854,4.35932s-3.15519,9.939-3.15519,9.939L678.68842,348.953Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#6c63ff"
                                />
                                <path
                                    d="M691.93342,268.70032l-5.45413,9.54473s-14.99885,8.18119-14.99885,9.54472,2.72706,12.49726,0,21.24749,5.20554,25.20618,6.81766,38.74793c6.81766,57.26836-13.4564,78.07668-17.72592,114.53672l43.268,12.63683s7.1827-95.8123,7.1827-117.62882S691.93342,268.70032,691.93342,268.70032Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#2f2e41"
                                />
                                <path
                                    d="M731.47586,264.60972l11.14636,6.33981s14.58658,3.21609,14.76075,4.56845.226,15.72546,4.04844,24.05567,2.76922,12.7597,13.06359,37.38552c5.25977,12.58224,17.33492,113.25015,17.33492,113.25015L750.5305,468.26941s-19.36232-94.11-22.149-115.74779S731.47586,264.60972,731.47586,264.60972Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#2f2e41"
                                />
                                <circle
                                    cx="372.61606"
                                    cy="33.54069"
                                    r="28.19388"
                                    fill="#ffb6b6"
                                />
                                <path
                                    d="M722.15989,245.32132c-6.6646-5.20939,2.44572-28.12577-8.56-23.23433,0,0-13.45145-8.56-16.154-2.93489-3.1293,6.51338-14.25851,3.55856-21.09433,1.25958a16.60841,16.60841,0,0,0,1.13726-3.90093,31.22909,31.22909,0,0,1-3.9987,2.67807,8.11676,8.11676,0,0,1-2.44572-2.00551,4.96705,4.96705,0,0,1-.62367-5.63736c1.13725-1.74868,3.48512-2.28674,4.86695-3.8398a1.672,1.672,0,0,0,.2295-1.5362,4.39444,4.39444,0,0,1,3.93738-5.50333,1.58022,1.58022,0,0,0,.749-.16313,17.13328,17.13328,0,0,0,3.19165-2.51909c-1.60195.07337.357-9.73249,16.23961-7.87522,3.9987-.14673,6.08693,4.26336,10.0245,4.9604,9.54473-5.45413,18.06454,2.41348,22.21006,9.934C736.01491,212.52422,740.50278,236.7613,722.15989,245.32132Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#2f2e41"
                                />
                                <path
                                    d="M601.85909,204.87508h-252.73a18.15513,18.15513,0,0,0-18.14,18.13V450.73513a18.16363,18.16363,0,0,0,18.14,18.14h252.73a18.15509,18.15509,0,0,0,18.13-18.13995V223.00508A18.14658,18.14658,0,0,0,601.85909,204.87508Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#fff"
                                />
                                <path
                                    d="M486.3832,257.1428h-27a5,5,0,1,1,0-10h27a5,5,0,0,1,0,10Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#6c63ff"
                                />
                                <path
                                    d="M844.3832,486.87508h-27a5,5,0,0,1,0-10h27a5,5,0,0,1,0,10Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#6c63ff"
                                />
                                <path
                                    d="M556.3832,361.87508h-167a5,5,0,0,1,0-10h167a5,5,0,0,1,0,10Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#e6e6e6"
                                />
                                <path
                                    d="M556.3832,394.87508h-167a5,5,0,0,1,0-10h167a5,5,0,0,1,0,10Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#e6e6e6"
                                />
                                <path
                                    d="M556.3832,427.87508h-167a5,5,0,0,1,0-10h167a5,5,0,0,1,0,10Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#e6e6e6"
                                />
                                <path
                                    d="M522.24911,272.145h-98.73a18.15514,18.15514,0,0,0-18.14,18.13v29.73a18.16365,18.16365,0,0,0,18.14,18.14h98.73a18.15509,18.15509,0,0,0,18.13-18.14v-29.73A18.14658,18.14658,0,0,0,522.24911,272.145Zm16.13,47.86a16.14,16.14,0,0,1-16.13995,16.14H451.36633a43.98722,43.98722,0,0,1-43.98722-43.98722V290.275a16.15571,16.15571,0,0,1,16.14-16.13h98.73a16.14718,16.14718,0,0,1,16.13,16.13Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#e6e6e6"
                                />
                                <circle cx="143" cy="109" r="17" fill="#e6e6e6" />
                                <polygon
                                    points="182.11 148.27 106 148 130 142 132.99 132.13 156 132 162.89 141.76 180.29 146.27 181.87 146.68 182.11 148.27"
                                    fill="#e6e6e6"
                                />
                                <path
                                    d="M464.32753,309.72917c3.648-2.8515-1.33872-15.39537,4.68555-12.71791,0,0,7.363-4.68555,8.84232-1.60649,1.7129,3.56527,7.80476,1.94787,11.54653.68946a9.09074,9.09074,0,0,1-.62251-2.13527,17.09573,17.09573,0,0,0,2.18879,1.46591,4.44311,4.44311,0,0,0,1.33873-1.09777,2.71885,2.71885,0,0,0,.34138-3.08576c-.6225-.95719-1.90767-1.25171-2.66405-2.10181a.91524.91524,0,0,1-.12562-.84088,2.40541,2.40541,0,0,0-2.15523-3.01239.86493.86493,0,0,1-.41-.0893,9.37792,9.37792,0,0,1-1.747-1.37889c.87687.04017-.19541-5.32733-8.88917-4.3107-2.1888-.08032-3.33184,2.33366-5.48718,2.7152-5.22455-2.98546-9.8881,1.32108-12.15725,5.43765S454.28707,305.04362,464.32753,309.72917Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#e6e6e6"
                                />
                                <path
                                    d="M601.85909,204.87508h-252.73a18.15513,18.15513,0,0,0-18.14,18.13V450.73513a18.16363,18.16363,0,0,0,18.14,18.14h252.73a18.15509,18.15509,0,0,0,18.13-18.13995V223.00508A18.14658,18.14658,0,0,0,601.85909,204.87508Zm16.13,245.86005a16.14,16.14,0,0,1-16.14,16.14H463.18989A130.20079,130.20079,0,0,1,332.9891,336.67429V223.00508a16.15571,16.15571,0,0,1,16.14-16.13h252.73a16.14719,16.14719,0,0,1,16.13,16.13Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#e6e6e6"
                                />
                                <path
                                    d="M865.89621,709.81761l-315.3575.30731a1.19069,1.19069,0,0,1,0-2.38135l315.3575-.30731a1.19069,1.19069,0,0,1,0,2.38135Z"
                                    transform="translate(-330.9891 -189.87508)"
                                    fill="#cacaca"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-start w-full py-4 md:flex-row md:justify-between bg-[#dddddd]">
                    {/* List */}
                    <div className="flex flex-col items-center justify-center w-full  md:h-full md:w-4/12 ">
                        <div className="w-full px-8 mb-8 text-center">
                            <span className="font-sans text-xl font-bold leading-none tracking-wider text-center text-gray-900 md:tracking-wide md:text-2xl">
                                <span>Select your Home</span>
                                <span className="relative inline-block pl-2 mx-1 text-green-500 stroke-current">
                                    {selectedConstituency
                                        ? "Ward"
                                        : selectedCounty
                                        ? "Constituency"
                                        : "County"}
                                    <svg
                                        className="absolute -bottom-1 w-full max-h-1.5 pr-2"
                                        viewBox="0 0 55 5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M0.652466 4.00002C15.8925 2.66668 48.0351 0.400018 54.6853 2.00002"
                                            strokeWidth="2"
                                        ></path>
                                    </svg>
                                </span>
                            </span>
                        </div>
                        <div className="flex w-full p-4 pb-4 overflow-y-scroll bg-white md:w-10/12 rounded-2xl md:h-1/2 ring-2">
                            <div className="w-full h-auto pb-6 ">
                                {counties !== null &&
                                counties.length > 0 &&
                                constituencies.length <= 0
                                    ? counties.map((county) => (
                                          <a
                                              key={county.properties.OBJECTID}
                                              className={`flex flex-row items-center justify-between my-2 bg-white py-2 pl-2 pr-4 rounded-md shadow-md transition-transform transform hover:scale-105 ${
                                                  activePolygon ===
                                                  county.properties.COUNTY
                                                      ? "active bg-green-200"
                                                      : "bg-white"
                                              }`}
                                              onClick={() =>
                                                  handlePolygonClick(
                                                      county.properties.COUNTY,
                                                  )
                                              }
                                          >
                                              <p className="font-semibold tracking-wider text-black">
                                                  {county.properties.COUNTY}
                                              </p>

                                              {activePolygon ===
                                              county.properties.COUNTY ? (
                                                  <button
                                                      className="flex flex-row px-2 bg-blue-200 rounded-full ring-2"
                                                      onClick={() =>
                                                          handleCountySelect(
                                                              activePolygon,
                                                          )
                                                      }
                                                  >
                                                      <p className="pr-2">Select</p>
                                                      <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          strokeWidth="1.5"
                                                          stroke="currentColor"
                                                          className="w-6 h-6"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                          />
                                                      </svg>
                                                  </button>
                                              ) : (
                                                  ""
                                              )}
                                          </a>
                                      ))
                                    : wards.length <= 0 && constituencies.length > 0
                                    ? constituencies.map((constituency) => (
                                          <a
                                              key={constituency.id}
                                              className={` flex flex-row items-center justify-between my-2 bg-gray-50 py-2 pl-2 rounded-md text-blue-600 ${
                                                  activePolygon ===
                                                  constituency.properties.name
                                                      ? "active"
                                                      : ""
                                              }`}
                                              onClick={() =>
                                                  handlePolygonClick(
                                                      constituency.properties.name,
                                                  )
                                              }
                                          >
                                              <p className="font-semibold tracking-wider">
                                                  {constituency.properties.name}
                                              </p>

                                              {activePolygon ===
                                              constituency.properties.name ? (
                                                  <button
                                                      className="flex flex-row px-2 bg-blue-200 rounded-full ring-2"
                                                      onClick={() =>
                                                          handleCountySelect(
                                                              activePolygon,
                                                          )
                                                      }
                                                  >
                                                      <p className="pr-2">Select</p>
                                                      <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          strokeWidth="1.5"
                                                          stroke="currentColor"
                                                          className="w-6 h-6"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                          />
                                                      </svg>
                                                  </button>
                                              ) : (
                                                  ""
                                              )}
                                          </a>
                                      ))
                                    : wards.map((ward) => (
                                          <a
                                              key={ward.id}
                                              className={` flex flex-row items-center justify-between my-2 bg-gray-50 py-2 pl-2 rounded-md text-blue-600 ${
                                                  activePolygon === ward.properties.name
                                                      ? "active"
                                                      : ""
                                              }`}
                                              onClick={() =>
                                                  handlePolygonClick(
                                                      ward.properties.name,
                                                  )
                                              }
                                          >
                                              <p className="font-semibold tracking-wider">
                                                  {ward.properties.name}
                                              </p>

                                              {activePolygon ===
                                              ward.properties.name ? (
                                                  <button
                                                      className="flex flex-row px-2 bg-blue-200 rounded-full ring-2"
                                                      onClick={() =>
                                                          handleCountySelect(
                                                              activePolygon,
                                                          )
                                                      }
                                                  >
                                                      <p className="pr-2">Select</p>
                                                      <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          strokeWidth="1.5"
                                                          stroke="currentColor"
                                                          className="w-6 h-6"
                                                      >
                                                          <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                          />
                                                      </svg>
                                                  </button>
                                              ) : (
                                                  ""
                                              )}
                                          </a>
                                      ))}
                            </div>
                        </div>
                    </div>
                    {/* Map Container */}
                    <div className="z-0 flex w-full md:w-8/12 ">
                        {bounds ? (
                            <MapContainer
                                center={[0, 37]}
                                zoom={6}
                                style={{height: "100vh", width: "100%"}}
                                bounds={bounds}
                                maxBounds={bounds}
                                // whenReady={handleMapReady}
                            >
                                <FitBoundsMap />
                                {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                                {counties !== null &&
                                counties.length > 0 &&
                                selectedCounty === null &&
                                selectedConstituency === null &&
                                selectedWard === null
                                    ? counties.map((county) => (
                                          <GeoJSON
                                              key={county.properties.OBJECTID}
                                              data={county}
                                              style={() => ({
                                                  fillColor:
                                                      activePolygon ===
                                                      county.properties.COUNTY
                                                          ? "green" // Kenyan flag color
                                                          : "white", // Kenyan flag color
                                                  fillOpacity: 0.7,
                                                  color: "black", // Kenyan flag color
                                                  weight: 2,
                                              })}
                                          />
                                      ))
                                    : null}

                                {constituencies &&
                                    selectedCounty !== null &&
                                    selectedConstituency === null &&
                                    constituencies.map((constituency) => (
                                        <GeoJSON
                                            key={constituency.id}
                                            data={constituency}
                                            style={() => ({
                                                fillColor:
                                                    activePolygon ===
                                                    constituency.properties.name
                                                        ? "blue"
                                                        : "gray",
                                                fillOpacity: 0.5,
                                                color: "black",
                                                weight: 1,
                                            })}
                                        />
                                    ))}

                                {wards &&
                                    selectedConstituency !== null &&
                                    selectedCounty !== null &&
                                    wards.map((ward) => (
                                        <GeoJSON
                                            key={ward.id}
                                            data={ward}
                                            style={() => ({
                                                fillColor:
                                                    activePolygon ===
                                                    ward.properties.name
                                                        ? "blue"
                                                        : "gray",
                                                fillOpacity: 0.5,
                                                color: "black",
                                                weight: 1,
                                            })}
                                        />
                                    ))}
                            </MapContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <p className="text-2xl">loading map ...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CountySelect;
