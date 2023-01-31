'use client'

import { Container, Form } from 'react-bootstrap'
import useAuth from '../(hooks)/useAuth'
import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: 'a23bd0da8a7e41129d9aa88aa9d8a08f'
})

export default function Dashboard({ code }) {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const accessToken = useAuth(code)

  console.log(searchResults)

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    spotifyApi.searchTracks(search).then(response => {
      setSearchResults(
        response.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              return image.height < smallest.height ? image : smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artist[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
          }
        })
      )
    })
  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' style={{ height: '100vh' }}>
      <Form.Control
        type='search'
        placeholder='Search Songs/Artists'
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className='flex-grow-1 my-2' style={{ overflowY: 'auto' }}>
        Songs
      </div>
      <div>Bottom</div>
    </Container>
  )
}