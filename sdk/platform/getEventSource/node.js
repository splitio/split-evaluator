let __isCustom = false;
let __eventSource = undefined;

// This function is only exposed for testing purposes.
function __setEventSource(eventSource) {
  __eventSource = eventSource;
  __isCustom = true;
}
function __restore() {
  __isCustom = false;
}

function getEventSource() {
  // returns EventSource at `eventsource` package. If not available, return global EventSource or undefined
  try {
    return __isCustom ? __eventSource : require('./eventsource.js');
  } catch (error) {
    console.error(error);
    return typeof EventSource === 'function' ? EventSource : undefined;
  }
}

module.exports = {
  getEventSource,
  __setEventSource,
  __restore,
};