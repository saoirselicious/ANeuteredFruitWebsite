import React, { useEffect, useState } from "react";

import peach from "../assets/peach.png";
import logo from "../assets/type.png";
import hero from "../assets/hero-smaller.jpg";
import bandcamp from "../assets/bandcamp.png";
import instagram from "../assets/instagram.png";

import { jsPDF } from "jspdf";

import Map from "./map";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import { getPhotos, getVideos, getShows } from "../sanityQueries";
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

export const BIOGRAPHY_TEXT_SHORT =
    "An instrumental progressive rock duo from Dublin, Ireland. They aspire for an expansive, high-energy sound that blends ideas from a bunch of different worlds.";

export const BIOGRAPHY_TEXT_LONG = `An instrumental progressive rock duo from Dublin, Ireland. They aspire for an expansive, high-energy sound that blends ideas from a bunch of different worlds. The duo first met in 2016 through UCD’s Jazz Society, bonding over their shared love of an ecclectic mix of music. Performing together college events for the Jazz Society they began to explore musically ideas.

They became active in Dublin’s broader music scene, collaborating with acts like Francis Helmet and Sisterix, and performing at venues such as The Button Factory, Marlay Park, and Electric Picnic. Between rehearsals, they often jammed on old punk tunes, which eventually led them to form the cover band Susie and The Switchblades. With a rotating lineup, the band quickly gained momentum performing in venues like Fibber Magees, The Sound House, and Workman’s.

Eager to push their creativity further, Stuart and Saoirse began writing original material. They initially explored a singer-songwriter approach, performing stripped-down acoustic sets at open mics, but soon realized their energy was better suited to louder, more absurd sounds. Embracing an instrumental format allowed them to fully express their ideas, borrowing notions from program music and focusing on three guiding principles: the music should make them laugh, have strong melodic content, and remain engaging to play. Crafting a concept for the album around their experiences during the pandemic, they recorded their new material at Beardfire Studios.

Their debut album 'We Don't Get Out Much' was released on January 2nd, 2026. Using their decade of friendship and experience performing together the duo now are taking their original music on the road for the first time. Their debut album marks a significant milestone, showcasing their growth as original artists and cementing their presence in Ireland’s contemporary music landscape.`;

export const SOUND_STYLE_TEXT = `We often say that the only thing that defines if an idea will make it, is if during the jam it makes us laugh.`;

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

const downloadEPK = async () => {
    const pdf = new jsPDF();

    let shows: any[] = [];
    try {
        shows = await getShows();
    } catch (err) {
        console.error("Failed to load shows for EPK:", err);
        shows = [];
    }

    const pageWidth = pdf.internal.pageSize.getWidth();

    let y = 25;

    // Title
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("A NEUTERED FRUIT", pageWidth / 2, y, {
        align: "center",
    });

    y += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Instrumental Progressive Rock", pageWidth / 2, y, {
        align: "center",
    });

    y += 20;

    // Biography
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Biography", 20, y);

    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const bio = `A Neutered Fruit are an Irish prog rock duo, cooked up from a healthy helping of chaos, beauty, and a touch of takin the piss. The pair first met performing jazz gigs together in college. Hitting it off, they worked with a variety of local acts, playing at Marlay Park and Electric Picnic. During lockdown, they began writing together as a creative outlet, drawing inspiration heavily from bands like The Mars Volta and Mastodon, along with whatever they were obsessed with that week. Those early ideas became their debut release, We Don't Get Out Much. Released in early 2026, blending majestic melodies, riotous riffs and colourful chords they're an act you won't forget quickly.`;

    const bioLines = pdf.splitTextToSize(
        bio,
        pageWidth - 40
    );

    pdf.text(bioLines, 20, y);

    y += bioLines.length * 5 + 15;

    // Music
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Music", 20, y);

    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(
        "We Don't Get Out Much — Debut Album",
        20,
        y
    );

    y += 6;

    pdf.text(
        "https://aneuteredfruit.bandcamp.com/album/we-dont-get-out-much",
        20,
        y
    );

    y += 15;

    // Shows
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Upcoming Shows", 20, y);

    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    // only include shows on or after today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingShows = (shows || []).filter((show) => {
        if (!show || !show.date) return false;
        const showDate = new Date(`${show.date}T12:00:00`);
        return showDate >= today;
    });

    if (upcomingShows.length === 0) {
        pdf.text(
            "No upcoming shows currently listed.",
            20,
            y
        );

        y += 8;
    } else {
        upcomingShows.forEach((show) => {
            const date = new Date(
                `${show.date}T12:00:00`
            ).toLocaleDateString("en-IE", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            pdf.setFont("helvetica", "bold");

            pdf.text(
                `${date} — ${show.venue}`,
                20,
                y
            );

            y += 5;

            pdf.setFont("helvetica", "normal");

            pdf.text(
                show.city,
                20,
                y
            );

            y += 5;

            if (
                show.otherBands &&
                show.otherBands.length > 0
            ) {
                pdf.text(
                    `Also playing: ${show.otherBands.join(", ")}`,
                    20,
                    y
                );

                y += 5;
            }

            if (show.promoter) {
                pdf.text(
                    `Presented by: ${show.promoter}`,
                    20,
                    y
                );

                y += 5;
            }

            y += 5;

            // Start a new page if necessary
            if (y > 270) {
                pdf.addPage();
                y = 25;
            }
        });
    }

    // Contact
    if (y > 240) {
        pdf.addPage();
        y = 25;
    }

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Contact", 20, y);

    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(
        "A Neutered Fruit",
        20,
        y
    );

    y += 5;

    pdf.text(
        "Dublin, Ireland",
        20,
        y
    );

    y += 5;

    pdf.text(
        "https://aneuteredfruit.com",
        20,
        y
    );

    y += 5;

    pdf.text(
        "https://aneuteredfruit.bandcamp.com",
        20,
        y
    );

    // Open PDF in a new tab
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
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
                <a href="#gig">Gigs</a>
                <a href="#listen">Listen</a>
                <a href="#photo">Photos</a>
                <a href="#video">Videos</a>

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

                <button className="btn" onClick={downloadEPK}>
                    Download
                </button>
            </div>
        </div>

        <div className="hero__image">
            <img src={hero} alt="A Neutered Fruit" />
        </div>
    </section>
);

/* =====================
   Listen
===================== */

export const Listen: React.FC = () => (
    <section id="listen" className="listen">
        <h3>Listen</h3>

        <div className="listen_content">


            <div className="bandcamp-player">
                <iframe
                    style={{
                        border: 0,
                        width: "350px",
                        height: "654px",
                    }}
                    src="https://bandcamp.com/EmbeddedPlayer/album=325852699/size=large/bgcol=ffffff/linkcol=0687f5/transparent=true/"
                    seamless
                >
                    <a href="https://aneuteredfruit.bandcamp.com/album/we-dont-get-out-much">
                        We Don't Get Out Much by a
                        neutered fruit
                    </a>
                </iframe>
            </div>
        </div>
    </section>
);



/* =====================
   GALLERY + IMAGE VIEWER
===================== */

export const Gallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [activeImage, setActiveImage] =
        useState<Photo | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [slideIndex, setSlideIndex] = useState(0);

    const [activeCategory, setActiveCategory] =
        useState("all");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        getPhotos()
            .then((data) => {
                setPhotos(data);
            })
            .catch((error) => {
                console.error(
                    "Failed to load photos:",
                    error
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const categories = [
        { label: "All", value: "all" },
        { label: "Live", value: "live" },
        {
            label: "Promo / Marketing",
            value: "promo",
        },
        {
            label: "Band",
            value: "band",
        },
        {
            label: "Logo / Branding",
            value: "branding",
        },
        {
            label: "Other",
            value: "other",
        },
    ];

    const filteredPhotos =
        activeCategory === "all"
            ? photos
            : photos.filter(
                (photo) =>
                    photo.category ===
                    activeCategory
            );

    useEffect(() => {
        setSlideIndex(0);
    }, [photos]);

    useEffect(() => {
        if (photos.length <= 1) return;

        const id = setInterval(() => {
            setSlideIndex((s) => (photos.length ? (s + 1) % photos.length : 0));
        }, 5000);

        return () => clearInterval(id);
    }, [photos]);

    const openImageModal = (items: Photo[], index: number) => {
        const img = items[index];
        const imgUrl = urlFor(img.image).width(1600).quality(95).url();
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

        Swal.fire({
            html: `<div><img src=\"${imgUrl}\" style=\"max-width:100%;object-fit:contain;display:block;margin:0 auto;\"/></div>`,
            customClass: { popup: `swal-image-popup${isMobile ? ' swal-image-popup-mobile' : ''}` },
            showCloseButton: false,
            showCancelButton: true,
            confirmButtonText: "Back",
            cancelButtonText: "Close",
            width: isMobile ? '40%' : 'auto',
            heightAuto: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // reopen gallery for the same category
                openGalleryModal(items);
            }
        });
    };

    const openGalleryModal = (items: Photo[]) => {
        const html = `<div class=\"swal-gallery-grid\">${items
            .map((p, i) => {
                const thumb = urlFor(p.image).width(400).quality(80).url();
                return `<img src=\"${thumb}\" data-idx=\"${i}\" class=\"swal-thumb\" alt=\"${(p.caption || '')}\"/>`;
            })
            .join("")}</div>`;

        Swal.fire({
            title: "Gallery",
            html,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: "Close",
            width: "90%",
            heightAuto: false,
            didOpen: () => {
                const container = document.querySelectorAll('.swal-thumb');
                container.forEach((el) => {
                    el.addEventListener('click', (e) => {
                        const idx = Number((e.currentTarget as HTMLElement).getAttribute('data-idx'));
                        Swal.close();
                        openImageModal(items, idx);
                    });
                });
            },
        });
    };

    return (
        <section id="photo" className="gallery">
            <h3>Photos</h3>

            {/* CATEGORY TABS */}

            {/* Mobile hamburger (shown only on small screens) */}
            <div className={`media-hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <button
                    className="btn"
                    aria-haspopup="menu"
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen((s) => !s)}
                >
                    Categories ▾
                </button>

                <div className="media-dropdown" role="menu">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            className={`btn ${activeCategory === category.value ? 'media-tabs__active' : ''}`}
                            onClick={() => {
                                const items = category.value === 'all' ? photos : photos.filter(p => p.category === category.value);
                                setActiveCategory(category.value);
                                openGalleryModal(items);
                                setMobileMenuOpen(false);
                            }}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="media-tabs">
                {categories.map((category) => (
                    <button
                        key={category.value}
                        className={`btn ${activeCategory ===
                            category.value
                            ? "media-tabs__active"
                            : ""
                            }`}
                        onClick={() => {
                            const items = category.value === 'all' ? photos : photos.filter(p => p.category === category.value);
                            setActiveCategory(category.value);
                            openGalleryModal(items);
                        }}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {loading && (
                <p>Loading gallery...</p>
            )}

            {!loading &&
                filteredPhotos.length === 0 && (
                    <p>
                        No photos in this category.
                    </p>
                )}

            {photos.length > 0 && (
                <div className="gallery-slideshow">
                    <button
                        className="gallery-nav"
                        aria-label="Previous"
                        onClick={() =>
                            setSlideIndex((s) =>
                                s <= 0 ? photos.length - 1 : s - 1
                            )
                        }
                    >
                        ‹
                    </button>

                    <img
                        src={urlFor(photos[slideIndex % photos.length].image)
                            .width(1200)
                            .quality(90)
                            .url()}
                        alt={photos[slideIndex % photos.length].caption || "A Neutered Fruit"}
                        onClick={() => openImageModal(photos, slideIndex % photos.length)}
                    />

                    <button
                        className="gallery-nav"
                        aria-label="Next"
                        onClick={() =>
                            setSlideIndex((s) => (s + 1) % photos.length)
                        }
                    >
                        ›
                    </button>
                </div>
            )}

            {/* IMAGE VIEWER */}

            {activeImage && (
                <div
                    className="image-viewer"
                    onClick={() =>
                        setActiveImage(null)
                    }
                >
                    <button
                        className="image-viewer__close"
                        onClick={() =>
                            setActiveImage(null)
                        }
                        aria-label="Close image"
                    >
                        ✕
                    </button>

                    <img
                        src={urlFor(
                            activeImage.image
                        )
                            .width(2000)
                            .quality(90)
                            .url()}
                        alt={
                            activeImage.caption ||
                            "A Neutered Fruit"
                        }
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    />

                    {activeImage.caption && (
                        <p>
                            {activeImage.caption}
                        </p>
                    )}

                    <div className="image-viewer__actions">
                        <a
                            href={urlFor(
                                activeImage.image
                            )
                                .width(2000)
                                .quality(95)
                                .url()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
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
    const [videos, setVideos] =
        useState<Video[]>([]);

    const [activeCategory, setActiveCategory] =
        useState("all");
    const [videoMobileMenuOpen, setVideoMobileMenuOpen] = useState(false);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        getVideos()
            .then((data) => {
                setVideos(data);
            })
            .catch((error) => {
                console.error(
                    "Failed to load videos:",
                    error
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const categories = [
        {
            label: "All",
            value: "all",
        },
        {
            label: "Music Videos",
            value: "music-video",
        },
        {
            label: "Live",
            value: "live",
        },
        {
            label: "Other",
            value: "other",
        },
    ];

    const filteredVideos =
        activeCategory === "all"
            ? videos
            : videos.filter(
                (video) =>
                    video.category ===
                    activeCategory
            );

    return (
        <section id="video" className="video">
            <h3>Videos</h3>

            {/* CATEGORY TABS */}

            <div className={`media-hamburger ${videoMobileMenuOpen ? 'open' : ''}`}>
                <button
                    className="btn"
                    aria-haspopup="menu"
                    aria-expanded={videoMobileMenuOpen}
                    onClick={() => setVideoMobileMenuOpen((s) => !s)}
                >
                    Categories ▾
                </button>

                <div className="media-dropdown" role="menu">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            className={`btn ${activeCategory === category.value ? 'media-tabs__active' : ''}`}
                            onClick={() => {
                                setActiveCategory(category.value);
                                setVideoMobileMenuOpen(false);
                            }}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="media-tabs">
                {categories.map((category) => (
                    <button
                        key={category.value}
                        className={`btn ${activeCategory ===
                            category.value
                            ? "media-tabs__active"
                            : ""
                            }`}
                        onClick={() =>
                            setActiveCategory(
                                category.value
                            )
                        }
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {loading && (
                <p>Loading videos...</p>
            )}

            {!loading &&
                filteredVideos.length === 0 && (
                    <p>
                        No videos in this category.
                    </p>
                )}

            <div className="video__row">
                {filteredVideos.map((video) => (
                    <div
                        className="video__group"
                        key={video._id}
                    >
                        <h4>{video.title}</h4>

                        <div className="video__embed">
                            <iframe
                                src={getYouTubeEmbedUrl(
                                    video.youtubeUrl
                                )}
                                title={video.title}
                                allowFullScreen
                            />
                        </div>

                        {video.description && (
                            <p>
                                {video.description}
                            </p>
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

        <div className="section-inner">
            <Hero />
        </div>

        <hr className="divider" />

        <div className="section-inner">
            <Map />
        </div>

        <hr className="divider" />


        <div className="section-inner">
            <Listen />
        </div>

        {/* Biography and SoundStyle removed from page; texts are available as exported variables */}

        <hr className="divider" />

        <div className="section-inner">
            <Gallery />
        </div>

        <hr className="divider" />

        <div className="section-inner">
            <VideoSection />
        </div>




        <hr className="divider" />

        <div className="section-inner">
            <Contacts />
        </div>

        <hr className="divider" />

        <Footer />
    </>
);

export default Page;
