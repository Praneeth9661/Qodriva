import { useState } from 'react';
import './QodrivaSolutionHelp.css';

/**
 * Supply the current problem object and optional language-specific reference solutions.
 * Example: <QodrivaSolutionHelp problem={selectedProblem} solutions={problemSolutions[selectedProblem.id]} />
 */
export default function QodrivaSolutionHelp({ problem, solutions = {}, onInsertSolution }) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(0);
  const [language, setLanguage] = useState(Object.keys(solutions)[0] || 'JavaScript');
  if (!problem) return null;
  const hints = problem.hints || [
    'Rewrite the problem in your own words and identify the exact input and output.',
    'Try a small example by hand. Look for repeated work or a data structure that can speed up the search.',
    'Choose an algorithm, then check empty, minimum-size, duplicate, and boundary inputs.'
  ];
  const solution = solutions[language] || problem.referenceSolutions?.[language] || problem.solutions?.[language] || problem.solution || problem.referenceSolution || '';
  return <section className="qsh">
    <div className="qsh-topline"><div><span className="qsh-label">STUCK ON THIS PROBLEM?</span><p>Get a hint first, then reveal the worked solution.</p></div><button className="qsh-main-button" onClick={() => setOpen(value => !value)}>{open ? 'Hide help' : 'Need help? View solution'} <span>{open ? '−' : '↗'}</span></button></div>
    {open && <div className="qsh-panel">
      <div className="qsh-tabs"><button className={hint>0?'active':''} onClick={()=>setHint(0)}>Approach</button><button className={hint===1?'active':''} onClick={()=>setHint(1)}>Hints</button><button className={hint===2?'active':''} onClick={()=>setHint(2)}>Reference solution</button></div>
      {hint===0 && <div><h3>Think through the approach</h3><p>{problem.solutionExplanation || problem.approach || 'Start with a straightforward approach. Trace it on the sample input, then consider whether repeated scanning or extra memory can improve the time complexity.'}</p><p className="qsh-complexity"><b>Before coding:</b> identify time complexity, space complexity, and edge cases.</p><button className="qsh-secondary" onClick={()=>setHint(1)}>Show a hint →</button></div>}
      {hint===1 && <div><h3>Progressive hints</h3><ol>{hints.map((item,index)=><li key={index}>{item}</li>)}</ol><button className="qsh-secondary" onClick={()=>setHint(2)}>Reveal reference solution →</button></div>}
      {hint===2 && <div><h3>Reference solution</h3>{Object.keys(solutions).length>0 && <label className="qsh-language">Language <select value={language} onChange={event=>setLanguage(event.target.value)}>{Object.keys(solutions).map(name=><option key={name}>{name}</option>)}</select></label>}
        {solution ? <><pre><code>{solution}</code></pre><div className="qsh-solution-actions"><button className="qsh-secondary" onClick={()=>navigator.clipboard?.writeText(solution)}>Copy solution</button>{onInsertSolution && <button className="qsh-main-button" onClick={()=>onInsertSolution(solution)}>Load into editor</button>}</div></> : <p className="qsh-warning">A verified reference solution is not available for this problem yet. Add it to the problem data or expose it from your backend. This component will not invent a supposedly correct answer.</p>}
      </div>}
    </div>}
  </section>;
}
