const express = require('express');
const { generateReplies } = require('../services/dahl');

const router = express.Router();

const ALLOWED_TONES = ['friendly', 'casual', 'polite', 'professional', 'warm'];
const ALLOWED_STYLES = ['very-short', 'short', 'natural', 'slightly-detailed'];
const MAX_MESSAGE_LENGTH = 2000;

function getFriendlyErrorMessage(statusCode, message) {
  const lower = (message || '').toLowerCase();

  if (statusCode === 400 || /please enter|select a valid|must be .* characters|invalid/.test(lower)) {
    return message || 'Something went wrong while generating replies.';
  }

  if (statusCode === 429 || lower.includes('rate limit') || lower.includes('too many')) {
    return 'Please try again in a moment.';
  }

  if (statusCode === 401 || statusCode === 403 || lower.includes('unauthorized') || lower.includes('forbidden')) {
    return 'The AI service is currently unavailable.';
  }

  if (statusCode === 504 || lower.includes('timed out') || lower.includes('timeout') || lower.includes('temporarily unavailable')) {
    return 'The AI service is temporarily unavailable.';
  }

  if (lower.includes('invalid response') || lower.includes('malformed') || lower.includes('did not return') || lower.includes('expected format')) {
    return 'The AI returned an invalid response. Please try again.';
  }

  if (statusCode >= 500) {
    return 'Something went wrong while generating replies.';
  }

  return 'Something went wrong while generating replies.';
}

router.post('/', async (req, res, next) => {
  try {
    const { message, tone, style } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter a message first.' });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`
      });
    }

    if (!ALLOWED_TONES.includes(tone)) {
      return res.status(400).json({
        error: 'Please select a valid tone.'
      });
    }

    if (!ALLOWED_STYLES.includes(style)) {
      return res.status(400).json({
        error: 'Please select a valid style.'
      });
    }

    const replies = await generateReplies({
      message: trimmedMessage,
      tone,
      style
    });

    res.json({ replies });
  } catch (error) {
    const message = error && error.message ? error.message : 'Something went wrong while generating replies.';
    const statusCode = Number(error && error.statusCode ? error.statusCode : 500);
    const friendlyMessage = getFriendlyErrorMessage(statusCode, message);

    return res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
      error: friendlyMessage
    });
  }
});

module.exports = router;
