const config = require('config');
const IMPRESSIONS_PER_POST = config.get('impressionsPerPost') ? config.get('impressionsPerPost') : 500;

class ImpressionQueue {
  constructor() {
    this._impressions = [];
  }

  /**
   * addImpression  adds one impression into queue
   * @param {Object} impression 
   */
  addImpression(impression) {
    this._impressions.push(impression);
  }

  /**
   * getSize  returns the current size of the queue
   */
  getSize() {
    return this._impressions.length;
  }

  /**
   * getImpressionsToPost generates the impressions object to be sent
   */
  getImpressionsToPost() {
    const impressionsToPost = [];
    const splice = this._impressions.splice(0, IMPRESSIONS_PER_POST);
    const groupedImpressions = new Map();
  
    splice.forEach(impression => {
      // Builds the keyImpression object
      const keyImpressions = {
        keyName: impression.keyName,
        treatment: impression.treatment,
        time: impression.time,
        changeNumber: impression.changeNumber,
        label: impression.label,
      };
      // Checks if already exists in order to add o create new impression bulks
      if (!groupedImpressions.has(impression.feature)) {
        groupedImpressions.set(impression.feature, [keyImpressions]);
      } else {
        const currentImpressions = groupedImpressions.get(impression.feature);
        groupedImpressions.set(impression.feature, currentImpressions.concat(keyImpressions));
      }
    });
    
    // Builds the entire bulk
    /*
    {
      "impressions": [{
        "testName": "example-1",
        "keyImpressions": [impression1, impression2, ...]
      }, {
        "testName": "example-1",
        "keyImpressions": [impression1, impression2, ...]
      }]
    }
    */
    groupedImpressions.forEach((value, key) => {
      const impressionToPost = {
        testName: key,
        keyImpressions: value,
      };
      impressionsToPost.push(impressionToPost);
    });
    return impressionsToPost;
  }
}
module.exports = ImpressionQueue;