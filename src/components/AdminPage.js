import React, { useEffect, useState } from 'react';
import { useAdminState } from 'context/AdminContext';
import useMediaUpload from 'hooks/useMediaUpload';
import { Box, Row, Stack } from 'components/Core';

const AdminPage = (props) => {
  const {
    enabled,
    setEnabled,
    SettingsInput,
    images,
    updateImages,
  } = useAdminState();
  const { Uploader, openUploader } = useMediaUpload({ changeCb: loadImageUrl });

  function loadImageUrl(url) {
    updateImages({ action: 'add', url });
  }

  return (
    <>
      <Uploader />
      <SettingsInput />
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(!!e.target.checked)}
        />
        Enable WP + React feature
      </label>
      {enabled && (
        <Box className="wrd-space-5 wrd-pt-5">
          <Row>
            <button type="button" onClick={openUploader} className="button">
              Add Image
            </button>
          </Row>
          <Row className="wrd-space-5">
            {images.map((url, idx) => {
              return (
                <div key={idx} className="wrd-img-wrap">
                  <img src={url} className="wrd-img-150" />
                  <button
                    type="button"
                    className="notice-dismiss"
                    onClick={() =>
                      updateImages({ action: 'remove', index: idx })
                    }
                  >
                    <span className="screen-reader-text">
                      Delete this image.
                    </span>
                  </button>
                </div>
              );
            })}
          </Row>
        </Box>
      )}
    </>
  );
};

export default AdminPage;
