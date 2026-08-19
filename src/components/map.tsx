import { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../index.css";

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { getShows } from "../sanityQueries";

/* =====================
   TYPES
===================== */

type Show = {
    _id: string;
    date: string;
    venue: string;
    city: string;
    description?: string;
    time?: string;
    ticketUrl?: string;
    published?: boolean;
    latitude?: number | null;
    longitude?: number | null;
};

/* =====================
   MAP ICONS
===================== */

const defaultIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const highlightedIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [30, 49],
    iconAnchor: [15, 49],
});

/* =====================
   DATE FORMATTER
===================== */

const formatDate = (date: string) => {
    const parsedDate = new Date(`${date}T12:00:00`);

    return parsedDate.toLocaleDateString("en-IE", {
        day: "numeric",
        month: "short",
    });
};

/* =====================
   MAP
===================== */

export default function VenueMap() {
    const [shows, setShows] = useState<Show[]>([]);
    const [hoveredShow, setHoveredShow] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    /* =====================
       LOAD SHOWS
    ===================== */

    useEffect(() => {
        getShows()
            .then((data) => {
                setShows(data);
            })
            .catch((error) => {
                console.error("Failed to load shows:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    /* =====================
       TABLE COLUMNS
    ===================== */

    const columns = useMemo<ColumnDef<Show>[]>(
        () => [
            {
                header: "Venue",
                accessorKey: "venue",
            },
            {
                header: "Date",
                accessorKey: "date",

                cell: ({ getValue }) => {
                    return formatDate(getValue<string>());
                },
            },
        ],
        []
    );

    /* =====================
       TABLE
    ===================== */

    const table = useReactTable({
        data: shows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    /* =====================
       LOADING STATE
    ===================== */

    if (loading) {
        return (
            <section className="map">
                <h2>Gigs</h2>
                <p>Loading gigs...</p>
            </section>
        );
    }

    /* =====================
       RENDER
    ===================== */

    return (
        <section className="map">
            <h2>Gigs</h2>

            {shows.length === 0 ? (
                <p>No upcoming gigs.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "400px 1fr",
                        gap: 16,
                        height: 600,
                    }}
                >

                    {/* =====================
                        TABLE
                    ===================== */}

                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                            }}
                        >
                            <thead>
                                {table
                                    .getHeaderGroups()
                                    .map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(
                                                (header) => (
                                                    <th
                                                        key={header.id}
                                                        style={{
                                                            textAlign:
                                                                "left",
                                                            padding: 12,
                                                            borderBottom:
                                                                "1px solid #ddd",
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    ))}
                            </thead>

                            <tbody>
                                {table
                                    .getRowModel()
                                    .rows.map((row) => {
                                        const show = row.original;

                                        return (
                                            <tr
                                                key={show._id}
                                                onMouseEnter={() =>
                                                    setHoveredShow(
                                                        show._id
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredShow(null)
                                                }
                                                style={{
                                                    cursor: "pointer",

                                                    background:
                                                        hoveredShow ===
                                                            show._id
                                                            ? "#f5f5f5"
                                                            : "transparent",
                                                }}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            style={{
                                                                padding: 12,
                                                                borderBottom:
                                                                    "1px solid #eee",
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    ))}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {/* =====================
                        MAP
                    ===================== */}

                    <MapContainer
                        center={[53.4494762, -7.5029786]}
                        zoom={7}
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />

                        {shows
                            .filter(
                                (s) =>
                                    typeof s.latitude === "number" &&
                                    typeof s.longitude === "number" &&
                                    Number.isFinite(s.latitude) &&
                                    Number.isFinite(s.longitude)
                            )
                            .map((show) => (
                            <Marker
                                key={show._id}
                                position={[
                                    show.latitude,
                                    show.longitude,
                                ]}
                                icon={
                                    hoveredShow === show._id
                                        ? highlightedIcon
                                        : defaultIcon
                                }
                            >
                                <Popup>
                                    <strong>{show.venue}</strong>

                                    <br />

                                    {show.city}

                                    <br />

                                    {formatDate(show.date)}

                                    {show.time && (
                                        <>
                                            <br />
                                            {show.time}
                                        </>
                                    )}

                                    {show.description && (
                                        <>
                                            <br />
                                            <br />
                                            {show.description}
                                        </>
                                    )}

                                    {show.ticketUrl && (
                                        <>
                                            <br />
                                            <br />
                                            <a
                                                href={show.ticketUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Tickets
                                            </a>
                                        </>
                                    )}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </section>
    );
}
