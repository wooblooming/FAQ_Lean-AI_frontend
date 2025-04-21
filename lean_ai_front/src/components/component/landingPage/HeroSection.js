"use client";

import React from "react";

export default function GradientHeroSection() {
  return (
    <div style={styles.body}>
      <div style={styles.heroContainer}>
        <div style={styles.watermark}></div>

        <div className="hero-content">
          <h1 style={styles.gradientTitle}>GRADIENT</h1>
          <p style={styles.heroText}>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
            ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
            consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate
            velit esse molestie consequat, vel illum dolore eu feugiat nulla
            facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugiat
            nulla facilisi.
          </p>
        </div>

        <div style={styles.navContainer}>
          {navItems.map((item, idx) => (
            <div
              key={idx}
              style={styles.navItem}
              onMouseEnter={(e) => e.currentTarget.classList.add("hovered")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("hovered")}
              className="nav-item"
            >
              <h2 style={styles.navTitle}>{item.title}</h2>
              <p style={styles.navText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✨ Hover 효과를 위한 CSS-in-JS */}
      <style jsx>{`
        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}

const navItems = [
  {
    title: "NEWS",
    text: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
    sed diam nonummy nibh euismod tincidunt ut laoreet.`,
  },
  {
    title: "HOME",
    text: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
    sed diam nonummy nibh euismod tincidunt ut laoreet.`,
  },
  {
    title: "ABOUT US",
    text: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
    sed diam nonummy nibh euismod tincidunt ut laoreet.`,
  },
];

const styles = {
  body: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
    padding: "20px",
  },
  heroContainer: {
    width: "100%",
    maxWidth: "1200px",
    height: "600px",
    background:
      "linear-gradient(135deg, #9d91c9 0%, #8aa1c5 50%, #7ab3e0 100%)",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    position: "relative",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "60px 40px 30px",
  },
  gradientTitle: {
    fontSize: "3.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    letterSpacing: "2px",
  },
  heroText: {
    maxWidth: "600px",
    fontSize: "1rem",
    lineHeight: "1.6",
    marginBottom: "40px",
  },
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
  },
  navItem: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "5px",
    padding: "25px 15px",
    margin: "0 10px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  navTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  navText: {
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    opacity: 0.1,
    background: `repeating-linear-gradient(45deg, 
      rgba(255, 255, 255, 0.1) 0px, 
      rgba(255, 255, 255, 0.1) 20px, 
      transparent 20px, 
      transparent 40px)`,
  },
};
