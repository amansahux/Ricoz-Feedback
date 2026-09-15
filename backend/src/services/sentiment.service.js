// Simple deterministic sentiment analysis without external APIs
const positiveKeywords = [
  'good', 'great', 'excellent', 'amazing', 'love', 'wonderful', 'perfect', 'fantastic',
  'awesome', 'impressed', 'satisfied', 'happy', 'delighted', 'brilliant', 'superb'
];

const negativeKeywords = [
  'bad', 'terrible', 'awful', 'hate', 'poor', 'disappointing', 'useless', 'broken',
  'frustrated', 'angry', 'unhappy', 'disgusted', 'horrible', 'slow', 'broken', 'fail'
];

const topicKeywords = {
  delivery: ['delivery', 'shipping', 'arrived', 'arrived late', 'slow delivery', 'fast delivery'],
  product: ['product', 'quality', 'material', 'design', 'broke', 'defect'],
  support: ['support', 'help', 'customer service', 'response', 'assist'],
  checkout: ['checkout', 'payment', 'purchase', 'order', 'cart'],
  pricing: ['price', 'cost', 'expensive', 'cheap', 'value', 'affordabl'],
  website: ['website', 'app', 'interface', 'navigation', 'ui', 'ux'],
  packaging: ['package', 'box', 'wrapping', 'unbox'],
};

export const analyzeSentiment = (text) => {
  if (!text) return 'neutral';

  const lowerText = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;

  positiveKeywords.forEach(keyword => {
    const count = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
    positiveScore += count;
  });

  negativeKeywords.forEach(keyword => {
    const count = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
    negativeScore += count;
  });

  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

export const detectTopics = (text) => {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const detectedTopics = [];

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        if (!detectedTopics.includes(topic)) {
          detectedTopics.push(topic);
        }
      }
    });
  });

  return detectedTopics.length > 0 ? detectedTopics : ['other'];
};