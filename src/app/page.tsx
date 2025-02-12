"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [step, setStep] = useState(1);
  const [code] = useState(105925);
  const [inputCode, setInputCode] = useState("");
  const [hintShown, setHintShown] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scrambledText, setScrambledText] = useState({
    lat: "-- -- -- -",
    long: "-- -- -- -",
    date: "-- ---- ----",
  });

  useEffect(() => {
    if (step === 2) {
      const duration = 15000;
      const interval = 150;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min((currentStep / steps) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
          }, 500);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (isComplete) {
      const finalValues = {
        lat: "47° 36' 30\" N",
        long: "122° 20' 12\" W",
        date: "2025-02-15T18:00:00-08:00UTC",
      };

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let iterations = 0;
      const maxIterations = 15;

      const interval = setInterval(() => {
        iterations++;

        setScrambledText((prev) => ({
          lat: finalValues.lat
            .split('')
            .map((char, index) => {
              return iterations * 2 >= index ? char : chars[Math.floor(Math.random() * chars.length)];
            })
            .join(''),
          long: finalValues.long
            .split('')
            .map((char, index) => {
              return iterations * 2 - finalValues.lat.length >= index ? char : chars[Math.floor(Math.random() * chars.length)];
            })
            .join(''),
          date: finalValues.date
            .split('')
            .map((char, index) => {
              return iterations * 2 - (finalValues.lat.length + finalValues.long.length) >= index ? char : chars[Math.floor(Math.random() * chars.length)];
            })
            .join(''),
        }));

        if (iterations * 2 >= finalValues.lat.length + finalValues.long.length + finalValues.date.length) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isComplete]);

  const submitCode = (c: string) => {
    if (parseInt(c) === code) {
      setStep(2);
    } else {
      setError("Código de acceso incorrecto. Intenta de nuevo.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      {step === 1 && (
        <div className={styles.main}>
          <Image src="/eye.png" alt="logo" width={60} height={60} />
          <h2>Portal Ganymede 50</h2>
          <p className={styles.description}>
            Ingresa el código de acceso para ingresar al sistema.
          </p>
          <div className={styles.inputContainer}>
            <input
              type="number"
              placeholder="######"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <p>- H</p>
            <button onClick={() => submitCode(inputCode)}>Ingresar</button>
          </div>
          <a href="#ikea-50319029" onClick={() => setHintShown(!hintShown)}>
            {hintShown
              ? "¿Ya la recordaste? Ocultar pista"
              : "¿Olvidaste el código? Mostrar pista"}
          </a>
          {hintShown && (
            <div className={styles.hintContainer}>
              <p className={styles.hint}>
                El número del asteriode donde se encuentra nuestro observatorio.
              </p>
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
      {step === 2 && (
        <>
          {isComplete ? (
            <div className={styles.main}>
              <p className={styles.description}>
                Gracias por su cooperación, desplegando la información.
              </p>
              <div className={styles.coordinatesContainer}>
                <div className={styles.coordinateBox}>
                  <p className={styles.label}>Latitud</p>
                  <p className={styles.value}>{scrambledText.lat}</p>
                </div>
                <div className={styles.coordinateBox}>
                  <p className={styles.label}>Longitud</p>
                  <p className={styles.value}>{scrambledText.long}</p>
                </div>
                <div className={styles.coordinateBox}>
                  <p className={styles.label}>Fecha</p>
                  <p className={styles.value}>{scrambledText.date}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.main}>
              <p className={styles.description}>
                Código ingresado correctamente. Procesando solicitud...
              </p>
              <div className={styles.loadingBar}>
                <pre style={{ fontFamily: "monospace" }}>
                  [
                  {Array(Math.floor(progress / 5))
                    .fill("█")
                    .join("")}
                  {Array(20 - Math.floor(progress / 5))
                    .fill("▒")
                    .join("")}
                  ] {Math.floor(progress)}%
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
