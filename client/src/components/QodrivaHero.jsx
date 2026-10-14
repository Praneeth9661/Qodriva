
import React from "react";
import "./QodrivaHero.css";
import QodrivaGlobe from "./QodrivaGlobe";

const bars = [30, 42, 36, 51, 57, 54, 70, 60, 80, 74, 91, 100];

export default function QodrivaHero() {
  return (
    <section
      className="qodriva-hero"
      aria-labelledby="qodriva-hero-title"
    >
      {/* Background effects */}
      <div className="qh-grid" aria-hidden="true" />
      <div className="qh-glow qh-glow--one" aria-hidden="true" />
      <div className="qh-glow qh-glow--two" aria-hidden="true" />

      {/* LEFT: original content preserved */}
      <div className="qh-content">
        <div className="qh-eyebrow">
          <span className="qh-status-dot" />
          THE NEXT-GEN CODING ARENA
        </div>

        <h1 id="qodriva-hero-title">
          Build skills.
          <span> Break limits.</span>
        </h1>

        <p className="qh-description">
          Practice problems, sharpen your thinking, and turn every
          submission into progress. Welcome to Qodriva.
        </p>

        <div className="qh-actions">
          <a className="qh-button qh-button--primary" href="#problems">
            Start coding <span aria-hidden="true">↗</span>
          </a>

          <a className="qh-button qh-button--secondary" href="#features">
            Explore platform
          </a>
        </div>

        <div className="qh-proof">
          <span className="qh-proof-mark">{"</>"}</span>
          <span>Think clearly</span>
          <span className="qh-proof-separator">·</span>
          <span>Code boldly</span>
          <span className="qh-proof-separator">·</span>
          <span>Level up</span>
        </div>
      </div>

      {/* RIGHT: real 3D globe and original floating cards */}
      <div
        className="qh-scene"
        aria-label="Animated Qodriva coding planet"
      >
        {/* Real Three.js globe replaces the old CSS planet */}
        <div className="qh-planet-stage" aria-hidden="true">
          <QodrivaGlobe />
        </div>

        {/* Code card */}
        <div
          className="qh-code-card qh-code-card--left"
          aria-hidden="true"
        >
          <div className="qh-card-top">
            <span />
            <span />
            <span />
            <b>solution.js</b>
          </div>

          <div className="qh-code-lines">
            <p>
              <em>01</em>
              <span>
                <strong>function</strong> <b>solve</b>() {"{"}
              </span>
            </p>

            <p>
              <em>02</em>
              <span>
                &nbsp;&nbsp;<strong>return</strong>{" "}
                <i>"keep going"</i>;
              </span>
            </p>

            <p>
              <em>03</em>
              <span>{"}"}</span>
            </p>

            <p>
              <em>04</em>
              <span className="qh-token-muted">
                // one more challenge
              </span>
            </p>
          </div>

          <div className="qh-card-footer">
            <span /> PASSING TESTS <b>04/04</b>
          </div>
        </div>

        {/* Progress card */}
        <div
          className="qh-code-card qh-code-card--right"
          aria-hidden="true"
        >
          <div className="qh-card-top">
            <span />
            <span />
            <span />
            <b>progress.exe</b>
          </div>

          <div className="qh-progress-head">
            <span>Daily progress</span>
            <strong>+28%</strong>
          </div>

          <div className="qh-bars">
            {bars.map((height, index) => (
              <i
                key={index}
                style={{ "--bar-height": `${height}%` }}
              />
            ))}
          </div>

          <div className="qh-card-footer">
            <span /> STREAK ACTIVE <b>7 DAYS</b>
          </div>
        </div>

        {/* Floating labels */}
        <div
          className="qh-floating-tag qh-floating-tag--top"
          aria-hidden="true"
        >
          ✦&nbsp; LEARN BY DOING
        </div>

        <div
          className="qh-floating-tag qh-floating-tag--bottom"
          aria-hidden="true"
        >
          <span>↗</span> PROGRESS DETECTED
        </div>
      </div>
    </section>
  );
}
