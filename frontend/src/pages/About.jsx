function About() {
  const sections = [
    {
      title: 'What is FriendReply AI?',
      description:
        'FriendReply AI is a small tool that helps a person turn a message into a more natural reply. You paste a message, choose the tone and style, and the app generates three useful options you can send.'
    },
    {
      title: 'Why it was built',
      description:
        'It was built for the Hacktoberfest 2026 DEV Weekend Challenge to show how a practical AI app can be useful, simple, and beginner-friendly without adding complexity.'
    },
    {
      title: 'How it works',
      description:
        'The frontend sends the message to our backend. The backend validates the request, then sends the prompt to the configured open-weight model through Dahl. It returns exactly three reply suggestions for the frontend to display.'
    },
    {
      title: 'Why open-weight AI',
      description:
        'Open-weight models are a practical way to use modern AI in a small app without depending on a paid closed model. This project demonstrates how an open-weight model can be used in a real product workflow.'
    },
    {
      title: 'Technology used',
      description:
        'The frontend uses React with Vite, the backend uses Node.js and Express, and the AI request is sent through Dahl using an OpenAI-compatible API. The Dahl API key stays on the backend only.'
    },
    {
      title: 'Privacy',
      description:
        'This version does not use a database or user accounts. The app does not keep a history of messages. The project keeps the AI integration simple and focused on generating replies from the request in real time.'
    }
  ];

  return (
    <div className="about-page">
      <section className="about-header">
        <span className="eyebrow">About the app</span>
        <h1>Simple, useful, and transparent.</h1>
      </section>

      <div className="about-grid">
        {sections.map((section) => (
          <article key={section.title} className="about-card">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </article>
        ))}
      </div>

      <div className="architecture-box">
        <h2>How the request flows</h2>
        <div className="architecture-diagram" aria-label="Application architecture diagram">
          <div className="diagram-node">Frontend</div>
          <div className="diagram-arrow">↓</div>
          <div className="diagram-node">Express API</div>
          <div className="diagram-arrow">↓</div>
          <div className="diagram-node">Dahl</div>
          <div className="diagram-arrow">↓</div>
          <div className="diagram-node">Open-weight model</div>
        </div>
      </div>
    </div>
  );
}

export default About;
