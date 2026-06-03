import { useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '../index.css';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

type Venue = {
    id: string;
    name: string;
    date: string;
    position: [number, number];
};

const venues: Venue[] = [
    {
        id: "wild-duck-1",
        name: "The Wild Duck",
        date: "27 May",
        position: [53.3445718, -6.2657887],
    },
    {
        id: "wild-duck-2",
        name: "The Wild Duck",
        date: "31 May",
        position: [53.3445718, -6.2657887],
    },
    {
        id: "bogans",
        name: "Bogans Bar",
        date: "30 May",
        position: [54.6003126, -7.2998605],
    },
];

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const highlightedIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [30, 49],
    iconAnchor: [15, 49],
});

export default function VenueMap() {
    const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);

    const columns = useMemo<ColumnDef<Venue>[]>(
        () => [
            {
                header: "Venue",
                accessorKey: "name",
            },
            {
                header: "Date",
                accessorKey: "date",
            },
        ],
        []
    );

    const table = useReactTable({
        data: venues,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <section className="map">
            <h2>Gigs</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "400px 1fr",
                    gap: 16,
                    height: 600,
                }}
            >
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
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            style={{
                                                textAlign: "left",
                                                padding: 12,
                                                borderBottom: "1px solid #ddd",
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    onMouseEnter={() =>
                                        setHoveredVenue(row.original.name)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredVenue(null)
                                    }
                                    style={{
                                        cursor: "pointer",
                                        background:
                                            hoveredVenue === row.original.name
                                                ? "#f5f5f5"
                                                : "transparent",
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            style={{
                                                padding: 12,
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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

                    <Marker
                        position={[53.3445718, -6.2657887]}
                        icon={
                            hoveredVenue === "The Wild Duck"
                                ? highlightedIcon
                                : defaultIcon
                        }
                    >
                        <Popup>The Wild Duck</Popup>
                    </Marker>

                    <Marker
                        position={[54.6003126, -7.2998605]}
                        icon={
                            hoveredVenue === "Bogans Bar"
                                ? highlightedIcon
                                : defaultIcon
                        }
                    >
                        <Popup>Bogans Bar</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </section>
    );
}