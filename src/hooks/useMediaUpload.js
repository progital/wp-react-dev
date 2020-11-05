import React, { useRef } from 'react';
// import { MediaUpload } from '@wordpress/media-utils';
const utils = (window.wp && window.wp.mediaUtils) || {};
const { MediaUpload } = utils;

// TODO handle error ?
const useMediaUpload = ({ changeCb } = {}) => {
  const opener = useRef(null);
  const params = useRef(undefined);

  function selectImage(value) {
    if (typeof changeCb === 'function') {
      changeCb(value.url, params.current);
    }
  }

  function openUploader(args) {
    params.current = args;
    if (opener.current && opener.current.open) {
      opener.current.open();
      return;
    }

    console.log('Opener not available');
  }

  const Uploader = (props) => {
    return (
      <MediaUpload
        onSelect={selectImage}
        allowedTypes={['image']}
        render={({ open }) => {
          opener.current = { open };
          return null;
        }}
      />
    );
  };

  return { Uploader, openUploader };
};

export default useMediaUpload;
