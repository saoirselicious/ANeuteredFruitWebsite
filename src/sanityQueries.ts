import { sanityClient } from './sanity'

export const getShows = async () => {
    return sanityClient.fetch(`
        *[_type == "show" && published == true]
        | order(date asc) {
            _id,
            date,
            venue,
            city,
            description,
            time,
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
    | order(sortOrder asc)
  `)
}

export const getVideos = async () => {
    return sanityClient.fetch(`
    *[_type == "video"]
    | order(sortOrder asc)
  `)
}