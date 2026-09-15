export const calculateNPS = (responses) => {
  if (responses.length === 0) return null;

  const scores = responses.filter(r => r.npsScore !== undefined && r.npsScore !== null);
  if (scores.length === 0) return null;

  const promoters = scores.filter(r => r.npsScore >= 9).length;
  const detractors = scores.filter(r => r.npsScore <= 6).length;

  return Math.round(((promoters - detractors) / scores.length) * 100);
};

export const calculateCSAT = (responses) => {
  if (responses.length === 0) return null;

  const scores = responses.filter(r => r.csatScore !== undefined && r.csatScore !== null);
  if (scores.length === 0) return null;

  const satisfied = scores.filter(r => r.csatScore >= 4).length;
  return Math.round((satisfied / scores.length) * 100);
};

export const calculateCES = (responses) => {
  if (responses.length === 0) return null;

  const scores = responses.filter(r => r.cesScore !== undefined && r.cesScore !== null);
  if (scores.length === 0) return null;

  const sum = scores.reduce((acc, r) => acc + r.cesScore, 0);
  return (sum / scores.length).toFixed(1);
};