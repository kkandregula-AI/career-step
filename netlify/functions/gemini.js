exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'GEMINI_API_KEY not set in Netlify environment variables' } })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch(e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'Invalid request body' } })
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: text || JSON.stringify({ error: { message: 'Empty response from Gemini' } })
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: err.message } })
    };
  }
};
