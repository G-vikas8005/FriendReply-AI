const fs = require('fs');

const env = Object.fromEntries(
  fs.readFileSync('C:/Users/govin/Downloads/friendreply-ai/backend/.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i), line.slice(i + 1).trim()];
    })
);

const requestBody = {
  model: env.DAHL_MODEL,
  messages: [
    {
      role: 'system',
      content: 'You are FriendReply AI. Return ONLY valid JSON in this exact structure: {"replies":["reply 1","reply 2","reply 3"]}'
    },
    {
      role: 'user',
      content: 'Message:\nAre you coming tomorrow? We need to submit the project.\n\nTone: friendly\n\nStyle: short'
    }
  ],
  temperature: 0.7,
  max_tokens: 220
};

fetch(env.DAHL_BASE_URL.replace(/\/$/, '') + '/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.DAHL_API_KEY}`
  },
  body: JSON.stringify(requestBody)
})
  .then(async (response) => {
    const text = await response.text();
    console.log('STATUS', response.status);
    console.log(text.slice(0, 4000));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
