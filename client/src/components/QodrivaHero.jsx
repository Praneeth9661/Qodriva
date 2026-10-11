
import React from "react";
import "./QodrivaHero.css";

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

      {/* Hero content */}
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
          <a
            className="qh-button qh-button--primary"
            href="#problems"
          >
            Start coding <span aria-hidden="true">↗</span>
          </a>

          <a
            className="qh-button qh-button--secondary"
            href="#features"
          >
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

      {/* CSS 3D animation scene */}
      <div
        className="qh-scene"
        aria-label="Animated CSS 3D illustrations"
      >
        {/* Holographic orb */}
        <div className="qh-orb-wrap" aria-hidden="true">
          <div className="qh-orb-halo" />

          <div className="qh-orb">
            <div className="qh-orb-shine" />

            <div className="qh-orb-latitude qh-orb-latitude--one" />
            <div className="qh-orb-latitude qh-orb-latitude--two" />

            <div className="qh-orb-longitude qh-orb-longitude--one" />
            <div className="qh-orb-longitude qh-orb-longitude--two" />

            <div className="qh-orb-core" />
          </div>

          <div className="qh-orb-caption">
            <i />
            QODRIVA CORE
          </div>
        </div>

        {/* Rotating 3D cube */}
        <div className="qh-cube-position" aria-hidden="true">
          <div className="qh-cube">
            <div className="qh-cube-face qh-cube-face--front">
              <span>{"{ }"}</span>
              <small>LOGIC</small>
            </div>

            <div className="qh-cube-face qh-cube-face--back">
              <span>01</span>
              <small>BUILD</small>
            </div>

            <div className="qh-cube-face qh-cube-face--right">
              <span>JS</span>
              <small>CREATE</small>
            </div>

            <div className="qh-cube-face qh-cube-face--left">
              <span>λ</span>
              <small>THINK</small>
            </div>

            <div className="qh-cube-face qh-cube-face--top">
              <span>+</span>
            </div>

            <div className="qh-cube-face qh-cube-face--bottom">
              <span>Q</span>
            </div>
          </div>
        </div>

        {/* Orbital rings */}
        <div className="qh-orbits" aria-hidden="true">
          <div className="qh-orbit qh-orbit--a">
            <span />
          </div>

          <div className="qh-orbit qh-orbit--b">
            <span />
          </div>

          <div className="qh-orbit qh-orbit--c">
            <span />
          </div>
        </div>

        {/* Floating code card */}
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
              <em>01</em>{" "}
              <span className="qh-token-purple">function</span>{" "}
              <span className="qh-token-blue">solve</span>() {"{"}
            </p>

            <p>
              <em>02</em>&nbsp;&nbsp;
              <span className="qh-token-purple">return</span>{" "}
              <span className="qh-token-green">
                "keep going"
              </span>
              ;
            </p>

            <p>
              <em>03</em> {"}"}
            </p>

            <p>
              <em>04</em>{" "}
              <span className="qh-token-muted">
                // one more challenge
              </span>
            </p>
          </div>

          <div className="qh-card-footer">
            <span />
            PASSING TESTS
            <b>04/04</b>
          </div>
        </div>

        {/* Floating progress card */}
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

          {/* Fixed: valid JavaScript JSX instead of Python syntax */}
          <div className="qh-bars">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} />
            ))}
          </div>

          <div className="qh-card-footer">
            <span />
            STREAK ACTIVE
            <b>7 DAYS</b>
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
          <span>↗</span>
          PROGRESS DETECTED
        </div>
      </div>
    </section>
  );
}
