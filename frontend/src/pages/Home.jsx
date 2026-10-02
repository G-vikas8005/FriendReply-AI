import { useState } from 'react';
import MessageInput from '../components/MessageInput';
import ReplyCard from '../components/ReplyCard';
import { generateReply } from '../services/api';

function Home() {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('friendly');
  const [style, setStyle] = useState('short');
  const [replies, setReplies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Please enter a message first.');
      setReplies([]);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await generateReply({
        message: trimmedMessage,
        tone,
        style
      });

      setReplies(data.replies || []);
    } catch (err) {
      setReplies([]);
      setError(err.message || 'Unable to generate replies right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
    setReplies([]);
    setError('');
    setIsLoading(false);
    setCopiedIndex(null);
  };

  const handleCopy = async (replyText, index) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(replyText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = replyText;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex((currentIndex) => (currentIndex === index ? null : currentIndex)), 1800);
    } catch (copyError) {
      setError('Copy failed. Please try again.');
    }
  };

  return (
    <div className="home-page">
      <section className="hero-block">
        <span className="eyebrow">Reply ideas</span>
        <h1>Turn messages into natural replies.</h1>
        <p>
          Paste a message, choose your tone, and get three replies you can actually send.
        </p>
      </section>

      <MessageInput
        message={message}
        setMessage={setMessage}
        tone={tone}
        setTone={setTone}
        style={style}
        setStyle={setStyle}
        onGenerate={handleGenerate}
        onClear={handleClear}
        isLoading={isLoading}
        error={error}
      />

      {isLoading ? (
        <div className="loading-box" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <span>Working on it...</span>
        </div>
      ) : null}

      {replies.length > 0 ? (
        <section className="reply-grid" aria-live="polite">
          {replies.map((reply, index) => (
            <ReplyCard
              key={`${reply}-${index}`}
              reply={reply}
              index={index}
              copied={copiedIndex === index}
              onCopy={handleCopy}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default Home;
