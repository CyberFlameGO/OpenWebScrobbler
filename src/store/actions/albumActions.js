import { lastfmAPI, discogsAPI } from 'utils/adapters';

import {
  GET_ALBUM_INFO_LASTFM,
  GET_ALBUM_INFO_DISCOGS,
  CLEAR_ALBUM_SEARCH,
  CLEAR_ALBUM_ARTIST_SEARCH,
  CLEAR_ALBUM_TRACKLIST,
  SEARCH_ALBUM_LASTFM,
  SEARCH_ALBUM_DISCOGS,
  SEARCH_TOP_ALBUMS_LASTFM,
  SEARCH_TOP_ALBUMS_DISCOGS,
  SET_ALBUM_QUERY,
  SET_ARTIST_QUERY,
  PROVIDER_DISCOGS,
} from 'Constants';

export function searchAlbums(album, options = {}) {
  if (options.provider === PROVIDER_DISCOGS) {
    return {
      type: SEARCH_ALBUM_DISCOGS,
      payload: discogsAPI.get('', {
        params: {
          method: 'album.search',
          type: options.includeReleases ? 'release' : 'master',
          q: album.toLowerCase(), // dedupes case-sensitive cached queries
        },
      }),
    };
  } else {
    // Last.fm request
    return {
      type: SEARCH_ALBUM_LASTFM,
      payload: lastfmAPI.get('', {
        params: {
          method: 'album.search',
          album: album.toLowerCase(), // dedupes case-sensitive cached queries
        },
      }),
    };
  }
}

export function searchTopAlbums(artist, options = {}) {
  if (artist.discogsId) {
    return {
      type: SEARCH_TOP_ALBUMS_DISCOGS,
      payload: discogsAPI.get('', {
        params: {
          method: 'artist.getTopAlbums',
          artist_id: artist.discogsId,
          // sort: 'year',
          // sort_order: 'desc',
        },
      }),
    };
  } else {
    // Last.fm request
    const params = {
      method: 'artist.getTopAlbums',
      api_key: process.env.REACT_APP_LASTFM_API_KEY,
      format: 'json',
    };

    if (artist.mbid) {
      params.mbid = artist.mbid;
    } else {
      params.artist = artist.name.toLowerCase(); // dedupes case-sensitive cached queries
    }

    return {
      type: SEARCH_TOP_ALBUMS_LASTFM,
      payload: lastfmAPI.get('', {
        params,
      }),
    };
  }
}

export function setAlbumQuery(query) {
  return {
    type: SET_ALBUM_QUERY,
    payload: query,
  };
}

export function setArtistQuery(query) {
  return {
    type: SET_ARTIST_QUERY,
    payload: query,
  };
}

export function clearAlbumsSearch() {
  return {
    type: CLEAR_ALBUM_SEARCH,
  };
}

export function clearAlbumsArtistSearch() {
  return {
    type: CLEAR_ALBUM_ARTIST_SEARCH,
  };
}

export function clearAlbumTracklist() {
  return {
    type: CLEAR_ALBUM_TRACKLIST,
  };
}

export async function _discogsFindBestMatch(album) {
  const { data } = await discogsAPI.get('', {
    params: {
      method: 'album.search',
      type: 'release',
      // toLowerCase dedupes case-sensitive cached queries
      artist: album.artist.toLowerCase(),
      title: album.name.toLowerCase(),
    },
  });

  if (data.results && data.results.length > 0) {
    return data.results[0].master_id || data.results[0].id;
  }
}

export function getAlbum(album) {
  if (album.discogsId) {
    return {
      type: GET_ALBUM_INFO_DISCOGS,
      payload: discogsAPI.get('', {
        params: {
          method: 'album.getInfo',
          album_id: album.discogsId,
        },
      }),
    };
  } else {
    const searchParams = {};

    // Last.fm request
    if (album.mbid) {
      searchParams.mbid = album.mbid;
    } else {
      searchParams.artist = album.artist;
      searchParams.album = album.name;
    }

    return {
      type: GET_ALBUM_INFO_LASTFM,
      payload: lastfmAPI.get('', {
        params: {
          method: 'album.getInfo',
          ...searchParams,
        },
      }),
    };
  }
}
