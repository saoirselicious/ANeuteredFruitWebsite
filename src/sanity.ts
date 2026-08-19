import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'horxf8gx',
  dataset: 'production',
  apiVersion: '2026-08-19',
  useCdn: true,
})