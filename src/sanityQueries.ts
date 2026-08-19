import { sanityClient } from "./sanity";

export const getShows = async () => {
    return sanityClient.fetch(`
        *[_type == "show" && published == true]
        | order(date asc) {
            _id,
            date,
            venue,
            city,
            poster,
            otherBands,
            promoter,
            description,
            ticketUrl,
            published,
            latitude,
            longitude
        }
    `);
};

export const getPhotos = async () => {
    return sanityClient.fetch(`
        *[_type == "photo"]
        | order(sortOrder asc) {
            _id,
            image,
            caption,
            category,
            sortOrder
        }
    `);
};

export const getVideos = async () => {
    return sanityClient.fetch(`
        *[_type == "video"]
        | order(sortOrder asc) {
            _id,
            title,
            youtubeUrl,
            category,
            description,
            sortOrder
        }
    `);
};