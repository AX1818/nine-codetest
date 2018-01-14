'use strict';

const JSONStream = require('JSONStream');
const sendErrorResponse = require('../error-handler');

function getChannelStream (res) {
  const stream = JSONStream.parse('payload');

  let validPayload = false;
  stream.on('data', (payload) => {
    // payload must be an array
    if (!payload || !Array.isArray(payload)) {
      return;
    }

    validPayload = true;
    const mps = payload.filter((channel) => channel.drm && channel.episodeCount > 0)
    .map((channel) => {
      const {slug, title, image} = channel;
      return {image: image && image.showImage || '', slug, title};
    });

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({response: mps}));
    res.end();
  })
  .on('end', () => {
    if(!validPayload) {
      sendErrorResponse(res);
    }
  })
  .on('error', () => sendErrorResponse(res));

  return stream;
}

module.exports = getChannelStream;
