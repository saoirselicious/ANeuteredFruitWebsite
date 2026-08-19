import {createImageUrlBuilder} from '@sanity/image-url'
import {sanityClient} from './sanity'

const builder = createImageUrlBuilder(sanityClient)

export type SanityImageSource =
  | { _type?: string; asset?: { _ref?: string; _id?: string } }
  | { _ref?: string }
  | string

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}