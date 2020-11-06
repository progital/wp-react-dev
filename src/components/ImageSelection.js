import React, { useEffect, useState } from 'react';
import { useFrontendState } from 'context/FrontendContext';
import { Row } from 'components/Core';
import axios from 'axios';

const ImageSelection = (props) => {
  const { selected, setSelected, images, postId } = useFrontendState();
  // what state the app is in now
  // `selecting` - making selection
  // `saved` - the selection is saved
  // `saving` - doing the request
  const [status, setStatus] = useState(selected ? 'saved' : 'selecting');

  const saveSelection = () => {
    setStatus('saving');
  };

  useEffect(() => {
    if (status !== 'saving') {
      return;
    }

    const formData = new FormData();
    formData.append(
      'wpreactdev-input-user-options',
      JSON.stringify({
        url: selected,
      })
    );
    formData.append('wpreactdev-input-post-id', postId);

    axios.post('/', formData).then((response) => {
      setStatus('saved');
    });
  }, [status]);

  return (
    <>
      <p>Select image</p>
      <Row className="wrd-space-5">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            className={`wrd-img-100 wrd-mb-5 ${
              url === selected ? 'wrd-img-selected' : ''
            }`}
            onClick={() => {
              if (status !== 'selecting') {
                return;
              }
              setSelected(url);
            }}
          />
        ))}
      </Row>
      {status === 'selecting' ? (
        <button
          type="button"
          onClick={saveSelection}
          disabled={!selected}
          className="wrd-btn-select"
        >
          Save Selection
        </button>
      ) : null}
      {status === 'saved' ? (
        <button type="button" onClick={() => setStatus('selecting')}>
          Select Again
        </button>
      ) : null}
      {status === 'saving' ? (
        <button type="button" disabled>
          Saving...
        </button>
      ) : null}
    </>
  );
};

export default ImageSelection;
