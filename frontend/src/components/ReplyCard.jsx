function ReplyCard({ reply, index, onCopy, copied }) {
  return (
    <article className="reply-card">
      <div className="reply-label">Reply {index + 1}</div>
      <p>{reply}</p>
      <button type="button" className="copy-button" onClick={() => onCopy(reply, index)}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </article>
  );
}

export default ReplyCard;
