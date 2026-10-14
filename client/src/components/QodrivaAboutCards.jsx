import './QodrivaAboutCards.css';

const FEATURES = [
  { icon:'⌘', title:'Practice coding', text:'Work through Easy, Medium, and Hard challenges and build a consistent problem-solving routine.', target:'problems' },
  { icon:'◈', title:'Learn step by step', text:'Use structured paths for DSA, Java, Python, web development, full-stack, and AI/ML.', target:'learning-paths' },
  { icon:'♜', title:'Stay motivated', text:'Follow your points, streaks, accepted solutions, and leaderboard position.', target:'leaderboard' },
  { icon:'↗', title:'Prepare for opportunities', text:'Strengthen algorithmic thinking and practice skills useful for technical interviews and projects.', target:'problems' },
  { icon:'▤', title:'Measure progress', text:'See your solved problems, points, streaks, and difficulty breakdown in one profile.', target:'profile' },
  { icon:'✦', title:'Keep improving', text:'Set small goals, finish lessons, revisit weak topics, and learn through repeated practice.', target:'learning-paths' }
];

export default function QodrivaAboutCards({ onNavigate = () => {} }) {
  return <div className="qac-grid">{FEATURES.map((feature, index) =>
    <button className="qac-card" key={feature.title} style={{'--qac-index': index}} onClick={() => onNavigate(feature.target)}>
      <span className="qac-icon">{feature.icon}</span>
      <span className="qac-title">{feature.title}</span>
      <span className="qac-description">{feature.text}</span>
      <span className="qac-action">Explore feature <b>↗</b></span>
    </button>
  )}</div>;
}
