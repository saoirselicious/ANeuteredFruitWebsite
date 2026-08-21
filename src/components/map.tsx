import { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "../index.css";

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { getShows } from "../sanityQueries";
import { urlFor, type SanityImageSource } from "../sanityImage";

/* =====================
   TYPES
===================== */

type Show = {
    _id: string;
    date: string;
    venue: string;
    city: string;
    poster?: SanityImageSource;
    otherBands?: string[];
    promoter?: string;
    description?: string;
    ticketUrl?: string;
    published?: boolean;
    time?: string;
    latitude: number;
    longitude: number;
};

/* =====================
   ICONS
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
   DATE
===================== */

const formatDate = (date: string) => {
    const parsedDate = new Date(`${date}T12:00:00`);

    return parsedDate.toLocaleDateString("en-IE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

/* =====================
   COMPONENT
===================== */

export default function VenueMap() {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] =
        useState<"shows" | "map">("shows");

    const [selectedShow, setSelectedShow] =
        useState<Show | null>(null);

    const [hoveredShow, setHoveredShow] =
        useState<string | null>(null);

    const [posterOpen, setPosterOpen] =
        useState(false);
    const [showsCategory, setShowsCategory] =
        useState<"upcoming" | "past">("upcoming");

    const showDetailsModal = (show: Show) => {
        const posterUrl = show.poster
            ? urlFor(show.poster).width(800).quality(90).url()
            : null;

        const htmlParts: string[] = [];

        htmlParts.push(`<div><strong>${show.venue}</strong></div>`);
        htmlParts.push(`<div>${show.city}</div>`);
        htmlParts.push(`<div>${formatDate(show.date)}</div>`);
        if (show.time) htmlParts.push(`<div>${show.time}</div>`);
        if (show.description)
            htmlParts.push(`<div style="margin-top:8px">${show.description}</div>`);
        if (show.ticketUrl)
            htmlParts.push(`<div style="margin-top:8px"><a href=\"${show.ticketUrl}\" target=\"_blank\">Tickets</a></div>`);
        if (posterUrl)
            htmlParts.push(`<div style="margin-top:12px"><img src=\"${posterUrl}\" style=\"max-width:100%;height:auto;\"/></div>`);

        Swal.fire({
            title: show.venue,
            html: htmlParts.join(""),
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Close",
            height: "auto",
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedShow(show);
            }
        });
    };

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
       TABLE
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

    const filteredShows = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return shows.filter((s) => {
            const parsed = new Date(`${s.date}T12:00:00`);
            const isUpcoming = parsed.getTime() > today.getTime();

            return showsCategory === "upcoming" ? isUpcoming : !isUpcoming;
        });
    }, [shows, showsCategory]);

    const table = useReactTable({
        data: filteredShows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    /* =====================
       LOADING
    ===================== */

    if (loading) {
        return (
            <section id="gig" className="map">
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

            {/* TABS */}

            <div className="gig-tabs">
                <button
                    className={`btn ${
                        activeTab === "shows"
                            ? "gig-tabs__active"
                            : ""
                    }`}
                    onClick={() => setActiveTab("shows")}
                >
                    Show List
                </button>

                <button
                    className={`btn ${
                        activeTab === "map"
                            ? "gig-tabs__active"
                            : ""
                    }`}
                    onClick={() => setActiveTab("map")}
                >
                    Map
                </button>
            </div>

            {/* =====================
                SHOW LIST
            ===================== */}

            {activeTab === "shows" && (
                <div className="gig-list">

                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <button
                            className={`btn tab-upcoming ${showsCategory === "upcoming" ? "gig-tabs__active" : ""}`}
                            onClick={() => setShowsCategory("upcoming")}
                        >
                            Upcoming
                        </button>

                        <button
                            className={`btn tab-past ${showsCategory === "past" ? "gig-tabs__active" : ""}`}
                            onClick={() => setShowsCategory("past")}
                        >
                            Past
                        </button>
                    </div>

                    {filteredShows.length === 0 && (
                        <p>No {showsCategory === "upcoming" ? "upcoming" : "past"} gigs.</p>
                    )}

                    {filteredShows.length > 0 && (
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
                                            <tr
                                                key={headerGroup.id}
                                            >
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
                                                                header
                                                                    .column
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
                                            const show =
                                                row.original;

                                            return (
                                                <tr
                                                    key={show._id}
                                                    onMouseEnter={() =>
                                                        setHoveredShow(
                                                            show._id
                                                        )
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredShow(
                                                            null
                                                        )
                                                    }
                                                    onClick={() =>
                                                        showDetailsModal(
                                                            show
                                                        )
                                                    }
                                                    style={{
                                                        cursor:
                                                            "pointer",
                                                        background:
                                                            hoveredShow ===
                                                            show._id
                                                                ? "#f5f5f5"
                                                                : "transparent",
                                                    }}
                                                >
                                                    {row
                                                        .getVisibleCells()
                                                        .map(
                                                            (
                                                                cell
                                                            ) => (
                                                                <td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    style={{
                                                                        padding: 12,
                                                                        borderBottom:
                                                                            "1px solid #eee",
                                                                    }}
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </td>
                                                            )
                                                        )}
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* SELECTED SHOW */}

                    {selectedShow && (
                        <div className="gig-details">

                            <button
                                className="gig-details__close"
                                onClick={() =>
                                    setSelectedShow(null)
                                }
                                aria-label="Close gig details"
                            >
                                ✕
                            </button>

                            <div className="gig-details__content">

                                <div className="gig-details__info">
                                    <h3>
                                        {selectedShow.venue}
                                    </h3>

                                    <p>
                                        <strong>
                                            {formatDate(
                                                selectedShow.date
                                            )}
                                        </strong>
                                    </p>

                                    <p>
                                        {selectedShow.city}
                                    </p>

                                    {selectedShow.description && (
                                        <p>
                                            {
                                                selectedShow.description
                                            }
                                        </p>
                                    )}

                                    {selectedShow.otherBands &&
                                        selectedShow.otherBands
                                            .length > 0 && (
                                            <div>
                                                <h4>
                                                    Also playing
                                                </h4>

                                                <ul>
                                                    {selectedShow.otherBands.map(
                                                        (
                                                            band,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={`${band}-${index}`}
                                                            >
                                                                {band}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    {selectedShow.promoter && (
                                        <p>
                                            <strong>
                                                Presented by:
                                            </strong>{" "}
                                            {
                                                selectedShow.promoter
                                            }
                                        </p>
                                    )}

                                    {selectedShow.ticketUrl && (
                                        <a
                                            href={
                                                selectedShow.ticketUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn"
                                        >
                                            Tickets
                                        </a>
                                    )}

                                    {selectedShow.poster && (
                                        <button
                                            className="btn"
                                            onClick={() =>
                                                setPosterOpen(
                                                    true
                                                )
                                            }
                                        >
                                            View Poster
                                        </button>
                                    )}
                                </div>

                                {selectedShow.poster && (
                                    <div className="gig-details__poster">
                                        <img
                                            src={urlFor(
                                                selectedShow.poster
                                            )
                                                .width(800)
                                                .quality(90)
                                                .url()}
                                            alt={`${selectedShow.venue} poster`}
                                            onClick={() =>
                                                setPosterOpen(
                                                    true
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* =====================
                MAP
            ===================== */}

            {activeTab === "map" && (
                <div
                    style={{
                        height: 600,
                        width: "100%",
                    }}
                >
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

                        {shows.map((show) => (
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
                                eventHandlers={{
                                    click: () => {
                                        setSelectedShow(show);
                                        setActiveTab("shows");
                                    },
                                }}
                            >
                                <Popup>
                                    <strong>
                                        {show.venue}
                                    </strong>

                                    <br />

                                    {show.city}

                                    <br />

                                    {formatDate(show.date)}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

            {/* =====================
                POSTER LIGHTBOX
            ===================== */}

            {posterOpen &&
                selectedShow?.poster && (
                    <div
                        className="image-viewer"
                        onClick={() =>
                            setPosterOpen(false)
                        }
                    >
                        <button
                            className="image-viewer__close"
                            onClick={() =>
                                setPosterOpen(false)
                            }
                            aria-label="Close poster"
                        >
                            ✕
                        </button>

                        <img
                            src={urlFor(
                                selectedShow.poster
                            )
                                .width(2000)
                                .quality(95)
                                .url()}
                            alt={`${selectedShow.venue} poster`}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        />
                    </div>
                )}
        </section>
    );
}