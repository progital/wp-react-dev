import React, { useRef } from 'react';
const utils = (window.wp && window.wp.mediaUtils) || {};
const { MediaUpload } = utils;

// TODO you may want to handle missing MediaUpload
// if, for example, it was not enqueued on the WP side
const useMediaUpload = ({ onChange } = {}) => {
  const opener = useRef(null);
  // parameters can be passed to the callback
  const params = useRef(undefined);

  function selectImage(value) {
    if (typeof onChange === 'function') {
      onChange(value.url, params.current);
    }
  }

  function openUploader(args) {
    params.current = args;
    if (opener.current && opener.current.open) {
      opener.current.open();
      return;
    }
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
