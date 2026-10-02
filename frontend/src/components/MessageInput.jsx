const MAX_MESSAGE_LENGTH = 2000;

function MessageInput({
  message,
  setMessage,
  tone,
  setTone,
  style,
  setStyle,
  onGenerate,
  onClear,
  isLoading,
  error
}) {
  return (
    <section className="panel">
      <label htmlFor="message" className="field-label">
        Message
      </label>

      <textarea
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Paste the message you want to reply to..."
        rows={9}
        maxLength={MAX_MESSAGE_LENGTH}
      />

      <div className="meta-row">
        <span className="character-count">{message.length} / {MAX_MESSAGE_LENGTH}</span>
        {error ? <span className="error-message">{error}</span> : null}
      </div>

      <div className="controls-grid">
        <div className="control-group">
          <label htmlFor="tone">Tone</label>
          <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="polite">Polite</option>
            <option value="professional">Professional</option>
            <option value="warm">Warm</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="style">Style</label>
          <select id="style" value={style} onChange={(event) => setStyle(event.target.value)}>
            <option value="very-short">Very short</option>
            <option value="short">Short</option>
            <option value="natural">Natural</option>
            <option value="slightly-detailed">Slightly detailed</option>
          </select>
        </div>
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onGenerate} disabled={isLoading}>
          {isLoading ? 'Working on it...' : 'Generate Replies'}
        </button>
        <button type="button" className="secondary-button" onClick={onClear}>
          Clear
        </button>
      </div>
    </section>
  );
}

export default MessageInput;
