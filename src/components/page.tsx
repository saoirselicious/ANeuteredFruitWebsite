import React, { useState } from "react";
import peach from "../assets/peach.png";
import logo from "../assets/type.png";
import hero from "../assets/hero-smaller.jpg";
import bandcamp from "../assets/bandcamp.png";
import instagram from "../assets/instagram.png";
/* =====================
   HEADER
===================== */
export const Header: React.FC = () => (
    <header className="header">
        <div className="header__logo"> <img src={peach} className="peach" alt="A Neutered Fruit Peach logo" /></div>
        <nav className="header__nav">
            <a href="#overview"><button className="btn">Overview</button></a>
            <a href="#bio"><button className="btn">Bio</button></a>
            <a href="#media"><button className="btn">Media</button></a>
            <a href="#contact"><button className="btn">Contact</button></a>
        </nav>
    </header>
);

/* =====================
   HERO
===================== */
export const Hero: React.FC = () => (
    <section className="hero">
        <div className="hero__text">
            <div className="ProjectName"> <img src={logo} height="300 em" className="logo" alt="A Neutered Fruit text logo" /></div>
            <p>... a lot will happen but it feels seemless. One moment it will be like funky prog, next it's computer game meets metal and it somehow works.</p>
            <div className="hero__buttons">
            <a href="#contact"><button className="btn">Contact</button></a>
                <button className="btn">Download</button>
            </div>
        </div>
        <div className="hero__image">
            <img src={hero} alt="Hero" />
        </div>
    </section>
);

/* =====================
   OVERVIEW
===================== */
export const Overview: React.FC = () => (
    <section id="overview" className="overview">
        <h2>Overview</h2>

        <div className="overview_content">

            {/* <div className="overview__column">
            <h3>Upcoming Shows</h3>
            <ul>
                <li>Show A</li>
                <li>Show B</li>
            </ul>
        </div> */}
            <div className="overview__column">
                <h3>Location</h3>
                <p>Dublin, Ireland</p>
            </div>
            <div className="overview__column">
                <h3>Releases</h3>
                <ul>
                    <iframe style={{ border: 0, width: '100%', height: '42px' }} src="https://bandcamp.com/EmbeddedPlayer/album=325852699/size=small/bgcol=333333/linkcol=0f91ff/transparent=true/" seamless><a href="https://aneuteredfruit.bandcamp.com/album/we-dont-get-out-much">We Don&#39;t Get Out Much by a neutered fruit</a></iframe>
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
            <h2>Biography</h2>
            <p>
                {expanded
                    ? <>An instrumental progressive rock duo from Dublin, Ireland. They aspire for an expansive, high-energy sound that blends ideas from a bunch of different worlds. The duo first met in 2016 through UCD’s Jazz Society, bonding over their shared love of an ecclectic mix of music. Performing together college events for the Jazz Society they began to explore musically ideas. <br /> <br />
                        They became active in Dublin’s broader music scene, collaborating with acts like Francis Helmet and Sisterix, and performing at venues such as The Button Factory, Marlay Park, and Electric Picnic. Between rehearsals, they often jammed on old punk tunes, which eventually led them to form the cover band Susie and The Switchblades. With a rotating lineup, the band quickly gained momentum performing in venues like Fibber Magees, The Sound House, and Workman’s.  <br /> <br />
                        Eager to push their creativity further, Stuart and Saoirse began writing original material. They initially explored a singer-songwriter approach, performing stripped-down acoustic sets at open mics, but soon realized their energy was better suited to louder, more absurd sounds. Embracing an instrumental format allowed them to fully express their ideas, borrowing notions from program music and focusing on three guiding principles: the music should make them laugh, have strong melodic content, and remain engaging to play. Crafting a concept for the album around their experiences during the pandemic, they recorded their new material at Beardfire Studios.  <br /> <br />
                        Their debut album 'We Don't Get Out Much' was released on January 2nd, 2026. Using their decade of friendship and experience performing together the duo now are taking their original music on the road for the first time. Their debut album marks a significant milestone, showcasing their growth as original artists and cementing their presence in Ireland’s contemporary music landscape.</>
                    : "An instrumental progressive rock duo from Dublin, Ireland. They aspire for an expansive, high-energy sound that blends ideas from a bunch of different worlds."}
            </p>
            <button className="btn" onClick={() => setExpanded(!expanded)}>
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
        <h2>Sound & Style</h2>
        <p>We often say that the only thing that defines if an idea will make it, is if during the jam it makes us laugh.</p>


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
                <summary><h4>Some of Saoirse's Favourites</h4></summary>
                <ul>
                    <li>Baroness</li>
                    <li>St Vincent</li>
                    <li>Between the Buried and Me</li>
                    <li>Nobuo Uematsu</li>
                    <li>Julian Lage</li>
                </ul>
            </details>

            <details>
                <summary><h4>Some of Stu's Favourites</h4></summary>
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
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

    return (
        <section id="media" className="gallery">
            <h2>Gallery</h2>
            <div className="gallery__grid">
                {images.map((src) => (
                    <img
                        key={src}
                        src={src}
                        onClick={() => setActiveImage(src)}
                        className="gallery__thumb"
                    />
                ))}
            </div>

            {activeImage && (
                <div className="image-viewer">
                    <img src={activeImage} alt="Expanded" />
                    <div className="image-viewer__actions">
                        <a href={activeImage} download>
                            Download HD
                        </a>
                        <a href={activeImage} download>
                            Download SD
                        </a>
                        <button onClick={() => setActiveImage(null)}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

/* =====================
   VIDEO PLAYER
===================== */
export const VideoSection: React.FC = () => (
    <section className="video">
        <h2>Video</h2>
        <video controls className="video__player">
            <source src="/video.mp4" type="video/mp4" />
        </video>
    </section>
);

/* =====================
   CONTACTS
===================== */
export const Contacts: React.FC = () => (
    <section id="contact" className="contacts">
        <h2>Contact</h2>
        <p>Email: aneuteredfruit@gmail.com</p>
    </section>
);

/* =====================
   FOOTER
===================== */
export const Footer: React.FC = () => (
    <footer className="footer">
        <div className="footer__logo">          <img src={peach} className="peach" alt="A Neutered Fruit Peach logo" />
        </div>
        <div className="footer__social">
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">Spotify</a>
        </div>
    </footer>
);

/* =====================
   PAGE COMPOSITION
===================== */
export const Page: React.FC = () => (
    <>
        <Header />
        <hr className='divider' />
        <Hero />
        <hr className='divider' />
        <Overview />
        <hr className='divider' />
        <Biography />
        <hr className='divider' />
        <SoundStyle />
        <hr className='divider' />
        <Gallery />
        {/* <hr className='divider' /> */}
        {/* <VideoSection /> */}
        <hr className='divider' />
        <Contacts />
        <hr className='divider' />
        <Footer />
    </>
);

export default Page;