const SYSTEM_PROMPT = `You are FriendReply AI, an assistant that helps people write natural responses to messages.

Your task is to generate exactly 3 reply suggestions.

Rules:
- Preserve the intended meaning of the original message.
- Do not invent facts.
- Do not invent commitments.
- Do not claim the user agreed to something unless the original context supports it.
- Make replies sound like a normal human wrote them.
- Avoid robotic or overly formal language unless the requested tone is professional.
- Follow the requested tone.
- Follow the requested style.
- Make the three suggestions meaningfully different.
- Keep replies concise.
- Do not include explanations.
- Do not include numbering inside the reply text.
- Do not include quotation marks around the replies.

Return ONLY valid JSON in this exact structure:
{
  "replies": [
    "reply 1",
    "reply 2",
    "reply 3"
  ]
}`;

const REQUEST_TIMEOUT_MS = 30000;

function sanitizeReplyText(rawText) {
  if (typeof rawText !== 'string') {
    return '';
  }

  return rawText
    .replace(/```json|```/gi, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/^[\r\n]+|[\r\n]+$/g, '');
}

function extractJsonPayload(raw) {
  if (typeof raw !== 'string') {
    return null;
  }

  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const content = fenceMatch ? fenceMatch[1].trim() : trimmed;

  const possibleObjects = [...content.matchAll(/\{[\s\S]*?\}/g)].map((match) => match[0]);

  for (const candidate of possibleObjects) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.replies)) {
        return parsed;
      }
    } catch (error) {
      // Ignore candidate objects that are not valid JSON.
    }
  }

  return null;
}

function validateReplies(replies) {
  if (!Array.isArray(replies)) {
    throw Object.assign(new Error('The AI returned an invalid response. Please try again.'), {
      statusCode: 502
    });
  }

  if (replies.length !== 3) {
    throw Object.assign(new Error('The AI returned an invalid response. Please try again.'), {
      statusCode: 502
    });
  }

  replies.forEach((reply) => {
    if (typeof reply !== 'string' || !reply.trim()) {
      throw Object.assign(new Error('The AI returned an invalid response. Please try again.'), {
        statusCode: 502
      });
    }
  });

  return replies.map((reply) => sanitizeReplyText(reply));
}

function getErrorMessageFromDahl(responseData, fallbackMessage) {
  if (!responseData || typeof responseData !== 'object') {
    return fallbackMessage;
  }

  if (typeof responseData.error === 'string' && responseData.error.trim()) {
    return responseData.error.trim();
  }

  if (responseData.error && typeof responseData.error.message === 'string' && responseData.error.message.trim()) {
    return responseData.error.message.trim();
  }

  return fallbackMessage;
}

async function generateReplies({ message, tone, style }) {
  const apiKey = process.env.DAHL_API_KEY;
  const baseUrl = process.env.DAHL_BASE_URL;
  const model = process.env.DAHL_MODEL;

  if (!apiKey || !baseUrl || !model) {
    throw Object.assign(new Error('Dahl API is not configured. Add DAHL_API_KEY, DAHL_BASE_URL, and DAHL_MODEL in backend/.env.'), {
      statusCode: 500
    });
  }

  const requestBody = {
    model,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `Message:\n${message}\n\nTone: ${tone}\n\nStyle: ${style}`
      }
    ],
    temperature: 0.7,
    max_tokens: 220
  };

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    let responseData;

    try {
      responseData = await response.json();
    } catch (error) {
      throw Object.assign(new Error('The AI returned an invalid response. Please try again.'), {
        statusCode: 502
      });
    }

    if (!response.ok) {
      const errorMessage = getErrorMessageFromDahl(responseData, 'The AI service is temporarily unavailable.');
      const statusCode = response.status >= 400 && response.status < 600 ? response.status : 502;
      const safeError = statusCode === 429
        ? 'Please try again in a moment.'
        : statusCode === 401 || statusCode === 403
          ? 'The AI service is currently unavailable.'
          : statusCode >= 500
            ? 'The AI service is temporarily unavailable.'
            : 'Something went wrong while generating replies.';

      throw Object.assign(new Error(safeError), {
        statusCode
      });
    }

    const content = responseData?.choices?.[0]?.message?.content;

    if (!content) {
      throw Object.assign(new Error('The AI returned an invalid response. Please try again.'), {
        statusCode: 502
      });
    }

    let parsed;

    try {
      parsed = extractJsonPayload(content);
      if (!parsed) {
        throw new Error('No valid JSON payload found.');
      }
    } catch (error) {
      throw Object.assign(new Error('The AI returned an invalid response. Please try again.'), {
        statusCode: 502
      });
    }

    const replies = validateReplies(parsed && parsed.replies);
    return replies;
  } catch (error) {
    if (error && error.name === 'TimeoutError') {
      throw Object.assign(new Error('The AI service is temporarily unavailable.'), {
        statusCode: 504
      });
    }

    if (error && error.name === 'AbortError') {
      throw Object.assign(new Error('The AI service is temporarily unavailable.'), {
        statusCode: 504
      });
    }

    throw error;
  }
}

module.exports = {
  generateReplies
};
