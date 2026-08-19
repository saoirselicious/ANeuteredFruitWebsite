import React, { useEffect, useState } from "react";

import peach from "../assets/peach.png";
import logo from "../assets/type.png";
import hero from "../assets/hero-smaller.jpg";
import bandcamp from "../assets/bandcamp.png";
import instagram from "../assets/instagram.png";

import Map from "./map";

import { getPhotos, getVideos } from "../sanityQueries";
import { urlFor, type SanityImageSource } from "../sanityImage";

/* =====================
   TYPES
===================== */

type Photo = {
    _id: string;
    image: SanityImageSource;
    caption?: string;
    category?: string;
    featured?: boolean;
    sortOrder?: number;
};

type Video = {
    _id: string;
    title: string;
    youtubeUrl: string;
    category?: string;
    description?: string;
    sortOrder?: number;
};

const getYouTubeEmbedUrl = (url: string): string => {
    try {
        const parsed = new URL(url);

        // Already an embed URL
        if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
            return url;
        }

        // Normal youtube.com/watch?v=...
        if (parsed.hostname.includes("youtube.com")) {
            const videoId = parsed.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        if (parsed.hostname === "youtu.be") {
            const videoId = parsed.pathname.replace("/", "");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }
    } catch (error) {
        console.error("Invalid YouTube URL:", url, error);
    }

    return url;
};

/* =====================
   HEADER
===================== */

export const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header__logo">
                <img src={peach} className="peach" alt="Logo" />
            </div>

            <button
                className="burger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            <nav className={`header__nav ${menuOpen ? "is-open" : ""}`}>
                <a href="#overview">Overview</a>
                <a href="#bio">Bio</a>
                <a href="#media">Media</a>
                <a href="#contact">Contact</a>
            </nav>
        </header>
    );
};

/* =====================
   HERO
===================== */

export const Hero: React.FC = () => (
    <section className="hero">
        <div className="hero__text">
            <div className="ProjectName">
                <img
                    src={logo}
                    height="300"
                    className="logo"
                    alt="A Neutered Fruit text logo"
                />
            </div>

            <p>
                ... a lot will happen but it feels seemless. One moment it will
                be like funky prog, next it's computer game meets metal and it
                somehow works.
            </p>

            <div className="hero__buttons">
                <a href="#contact">
                    <button className="btn">Contact</button>
                </a>

                <button className="btn">Download</button>
            </div>
        </div>

        <div className="hero__image">
            <img src={hero} alt="A Neutered Fruit" />
        </div>
    </section>
);

/* =====================
   OVERVIEW
===================== */

export const Overview: React.FC = () => (
    <section id="overview" className="overview">
        <h3>Overview</h3>

        <div className="overview_content">

            <div className="overview__column">
                <h3>Location</h3>
                <p>Dublin, Ireland</p>
            </div>

            <div className="overview__column">
                <h3>Releases</h3>

                <ul>
                    <iframe
                        style={{
                            border: 0,
                            width: "100%",
                            height: "42px",
                        }}
                        src="https://bandcamp.com/EmbeddedPlayer/album=325852699/size=small/bgcol=333333/linkcol=0f91ff/transparent=true/"
                        seamless
                    >
                        <a href="https://aneuteredfruit.bandcamp.com/album/we-dont-get-out-much">
                            We Don't Get Out Much by a neutered fruit
                        </a>
                    </iframe>
                </ul>
            </div>
        </div>
    </section>
);

/* =====================
   BIOGRAPHY
===================== */

export const Biography: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <section id="bio" className="bio">
            <h3>Biography</h3>

            <p>
                {expanded ? (
                    <>
                        A Neutered Fruit are an Irish prog rock duo, cooked up from a healthy helping of chaos, beauty, and a touch of takin the piss. The pair first met performing jazz gigs together in college. Hitting it off, they worked with a variety of local acts, playing at Marlay Park and Electric Picnic. During lockdown, they began writing together as a creative outlet, drawing inspiration heavily from bands like The Mars Volta and Mastodon, along with whatever they were obsessed with that week. Those early ideas became their debut release, We Don't Get Out Much. Released in early 2026, blending majestic melodies, riotous riffs and colourful chords they're an act you won't forget quickly.
                    </>
                ) : (
                    "An instrumental progressive rock duo from Dublin, Ireland. They aspire for an expansive, high-energy sound that blends ideas from a bunch of different worlds."
                )}
            </p>

            <button
                className="btn"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Show Less" : "Read More"}
            </button>
        </section>
    );
};

/* =====================
   SOUND STYLE
===================== */

export const SoundStyle: React.FC = () => (
    <section className="sound">
        <h3>Sound & Style</h3>

        <p>
            We often say that the only thing that defines if an idea will make
            it, is if during the jam it makes us laugh.
        </p>

        <div className="sound__grid">

            <div>
                <h4>Some of Our Influences</h4>

                <ul>
                    <li>The Mars Volta</li>
                    <li>Mastodon</li>
                    <li>Chelsea Wolfe</li>
                    <li>The Dillinger Escape Plan</li>
                    <li>Paramore</li>
                </ul>
            </div>

            <div>
                <h4>Key Characteristics</h4>

                <ul>
                    <li>Overplaying</li>
                    <li>Lots of changes</li>
                    <li>Uncommon harmony</li>
                    <li>Hooks</li>
                    <li>Drama</li>
                </ul>
            </div>

            <details>
                <summary>
                    <h4>Some of Saoirse's Favourites</h4>
                </summary>

                <ul>
                    <li>Baroness</li>
                    <li>St Vincent</li>
                    <li>Between the Buried and Me</li>
                    <li>Nobuo Uematsu</li>
                    <li>Julian Lage</li>
                </ul>
            </details>

            <details>
                <summary>
                    <h4>Some of Stu's Favourites</h4>
                </summary>

                <ul>
                    <li>John Maus</li>
                    <li>Agriculture</li>
                    <li>Blood Incantation</li>
                    <li>Gentle Giant</li>
                    <li>Aphex Twin</li>
                </ul>
            </details>

        </div>
    </section>
);

/* =====================
   GALLERY + IMAGE VIEWER
===================== */

export const Gallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [activeImage, setActiveImage] = useState<Photo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPhotos()
            .then((data) => {
                setPhotos(data);
            })
            .catch((error) => {
                console.error("Failed to load photos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section id="media" className="gallery">
            <h3>Gallery</h3>

            {loading && <p>Loading gallery...</p>}

            {!loading && photos.length === 0 && (
                <p>No photos available.</p>
            )}

            <div className="gallery__grid">
                {photos.map((photo) => (
                    <img
                        key={photo._id}
                        src={urlFor(photo.image)
                            .width(1000)
                            .quality(85)
                            .url()}
                        alt={photo.caption || "A Neutered Fruit"}
                        className="gallery__thumb"
                        onClick={() => setActiveImage(photo)}
                        loading="lazy"
                    />
                ))}
            </div>

            {activeImage && (
                <div className="image-viewer">

                    <button
                        className="image-viewer__close"
                        onClick={() => setActiveImage(null)}
                        aria-label="Close image"
                    >
                        ✕
                    </button>

                    <img
                        src={urlFor(activeImage.image)
                            .width(2000)
                            .quality(90)
                            .url()}
                        alt={activeImage.caption || "A Neutered Fruit"}
                    />

                    {activeImage.caption && (
                        <p>{activeImage.caption}</p>
                    )}

                    <div className="image-viewer__actions">
                        <a
                            href={urlFor(activeImage.image)
                                .width(2000)
                                .quality(95)
                                .url()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open HD
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
};

/* =====================
   VIDEO PLAYER
===================== */

export const VideoSection: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVideos()
            .then((data) => {
                setVideos(data);
            })
            .catch((error) => {
                console.error("Failed to load videos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section className="video">
            <h3>Videos</h3>

            {loading && <p>Loading videos...</p>}

            {!loading && videos.length === 0 && (
                <p>No videos available.</p>
            )}

            <div className="video__row">
                {videos.map((video) => (
                    <div
                        className="video__group"
                        key={video._id}
                    >
                        <h4>{video.title}</h4>

                        <div className="video__embed">
                            <iframe
                                src={getYouTubeEmbedUrl(video.youtubeUrl)}
                                title={video.title}
                                allowFullScreen
                            />
                        </div>

                        {video.description && (
                            <p>{video.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

/* =====================
   CONTACTS
===================== */

export const Contacts: React.FC = () => (
    <section id="contact" className="contacts">
        <h3>Contact</h3>
        <p>Email: aneuteredfruit@gmail.com</p>
    </section>
);

/* =====================
   FOOTER
===================== */

export const Footer: React.FC = () => (
    <footer className="footer">
        <div className="footer__logo">
            <img
                src={peach}
                className="peach"
                alt="A Neutered Fruit Peach logo"
            />
        </div>

        <div className="footer__social">
            <a href="https://www.instagram.com/a_neutered_fruit/">
                <img
                    src={instagram}
                    className="social-icon"
                    alt="Instagram"
                    width="60"
                    height="60"
                />
            </a>

            <a href="https://aneuteredfruit.bandcamp.com/album/we-dont-get-out-much">
                <img
                    src={bandcamp}
                    className="social-icon"
                    alt="Bandcamp"
                    width="60"
                    height="60"
                />
            </a>
        </div>
    </footer>
);

/* =====================
   PAGE COMPOSITION
===================== */

export const Page: React.FC = () => (
    <>
        <Header />

        <hr className="divider" />

        <Hero />

        <hr className="divider" />

        <Overview />

        <hr className="divider" />

        <Biography />

        <hr className="divider" />

        <SoundStyle />

        <hr className="divider" />

        <Gallery />

        <hr className="divider" />

        <VideoSection />

        <hr className="divider" />

        <Map />

        <hr className="divider" />

        <Contacts />

        <hr className="divider" />

        <Footer />
    </>
);

export default Page;
