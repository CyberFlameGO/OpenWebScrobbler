import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { faCompactDisc, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AlbumBreadcrumb.scss';

function generateBreadcrumbItem(targetPath, caption, icon) {
  return (
    <BreadcrumbItem className="ows-AlbumBreadcrumb-item" tag={Link} to={targetPath} key={targetPath}>
      {icon && <FontAwesomeIcon icon={icon} className="mr-2 mt-1" />}
      {caption}
    </BreadcrumbItem>
  );
}

export default function AlbumBreadcrumb({ albumQuery, artistQuery, album, dataProvider }) {
  const { t } = useTranslation();
  const itemList = [generateBreadcrumbItem('/scrobble/album', t('search'))];

  if (albumQuery) {
    itemList.push(
      generateBreadcrumbItem(`/scrobble/album/search/${encodeURIComponent(albumQuery)}`, `"${albumQuery}"`)
    );
  }

  const albumArtist = album.artist;
  if (artistQuery || albumArtist) {
    itemList.push(
      generateBreadcrumbItem(
        `/scrobble/artist/${encodeURIComponent(albumArtist || artistQuery)}`,
        albumArtist || `"${artistQuery}"`,
        albumArtist ? faUser : undefined
      )
    );
  }

  if (album.name) {
    let targetPath;
    if (album.mbid) {
      targetPath = `/scrobble/album/view/mbid/${album.mbid}`;
    } else if (album.discogsId) {
      targetPath = `/scrobble/album/view/dsid/${album.discogsId}`;
    } else {
      targetPath =
        `/scrobble/album/view/${encodeURIComponent(album.artist.replace('%', ''))}` +
        `/${encodeURIComponent(album.name.replace('%', ''))}`;
    }

    itemList.push(generateBreadcrumbItem(targetPath, album.name, faCompactDisc));
  }

  return (
    <Breadcrumb className="my-3">
      {itemList}
      {dataProvider && (
        <div className="flex-grow-1 text-right">
          {t('dataProvider')}: {dataProvider}
        </div>
      )}
    </Breadcrumb>
  );
}

AlbumBreadcrumb.propTypes = {
  albumQuery: PropTypes.string,
  artistQuery: PropTypes.string,
  album: PropTypes.object,
  dataProvider: PropTypes.string,
};

AlbumBreadcrumb.defaultProps = {
  album: {},
};
