const Impressions = new Map();

const logImpression = (impressionData) => {
  const impression = impressionData.impression;
  const keyImpressions = {
    keyName: impression.keyName,
    treatment: impression.treatment,
    time: impression.time,
    changeNumber: impression.changeNumber,
    label: impression.label,
  };
  if (!Impressions.has(impression.feature)) {
    Impressions.set(impression.feature, [keyImpressions]);
  } else {
    const currentImpressions = Impressions.get(impression.feature);
    Impressions.set(impression.feature, currentImpressions.concat(keyImpressions));
  }

  console.log('Impressions.size()', Impressions.size);
  Impressions.forEach((value, key) => {
    console.log('FEATURE:', key);
    console.log('KEY IMPRESSIONS:', value);
  });
};

module.exports = logImpression;