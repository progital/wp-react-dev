import React, { useEffect, useState } from 'react';
import { useFrontendState } from 'context/FrontendContext';
import { Box, Row, Stack } from 'components/Core';

const ImageSelection = (props) => {
  const { selected, setSelected, SettingsInput, images } = useFrontendState();
  // what state the app is in now
  // `selecting` - making selection
  // `saved` - the selection is saved
  const [status, setStatus] = useState(selected ? 'saved' : 'selecting');

  const saveSelection = () => {
    setStatus('saved');
  };

  return (
    <>
      <SettingsInput />
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
    </>
  );
};

export default ImageSelection;
