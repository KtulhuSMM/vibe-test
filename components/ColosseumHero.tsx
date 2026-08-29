"use client";

import { useEffect, useRef, useState } from "react";
import { chapters } from "@/data/chapters";

type Scene = "hero" | "arena" | "chapter" | "purchase";

export function ColosseumHero() {
  const [scene, setScene] = useState<Scene>("hero");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const audioRef = useRef<{ctx: AudioContext; source: AudioBufferSourceNode; gain: GainNode} | null>(null);

  const chapter = chapters[chapterIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [scene, chapterIndex]);

  useEffect(() => {
    return () => stopCrowd();
  }, []);

  function startCrowd() {
    if (audioRef.current || typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const seconds = 3;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = last * 0.985 + white * 0.015;
      data[i] = last * 2.8;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.55;
    const gain = ctx.createGain();
    gain.gain.value = 0.085;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
    audioRef.current = { ctx, source, gain };
  }

  function stopCrowd() {
    const audio = audioRef.current;
    if (!audio) return;
    try { audio.source.stop(); } catch {}
    void audio.ctx.close();
    audioRef.current = null;
  }

  function enterArena() {
    setFlippedIndex(null);
    setScene("arena");
    startCrowd();
  }

  function openChapter(index: number) {
    setChapterIndex(index);
    setScene("chapter");
    stopCrowd();
  }

  function flipCoin(index: number) {
    setFlippedIndex((current) => current === index ? null : index);
  }

  function returnToArena() {
    setFlippedIndex(null);
    setScene("arena");
  }

  return (
    <main className="experience" style={{ width: "100%", minHeight: "100svh", overflowX: "hidden" }}>
      {scene === "hero" && (
        <section className="scene hero scene--active">
          <img className="hero__background" src="/colosseum-hero.png" alt="Отреставрированный Колизей на закате" />
          <div className="hero__shade" aria-hidden="true" />

          <header className="hero__title-shield">
            <span className="longinus-spear" aria-hidden="true"><i /></span>
            <p className="hero__eyebrow">Интерактивная книга</p>
            <h1>Современный Колизей</h1>
            <p className="hero__subtitle">Гладиаторы успеха</p>
            <p className="hero__author">Копылов Николай Максимович</p>
          </header>

          <button className="hero__door-button" type="button" onClick={enterArena} aria-label="Войти в Колизей">
            <span className="sr-only">Войти в Колизей</span>
          </button>
        </section>
      )}

      {scene === "arena" && (
        <section className="scene arena scene--active" style={{ width: "100%", minHeight: "100svh", overflow: "hidden" }}>
          <img className="arena__background" src="/arena-gladiators.jpg" alt="Гладиаторы сражаются на арене перед заполненными трибунами" />
          <div className="arena__shade" aria-hidden="true" />

          <header className="arena__header">
            <p className="arena__eyebrow">Арена Колизея</p>
            <h2>Выберите главу</h2>
          </header>

          <div className="coins" aria-label="Первые пять глав книги">
            {chapters.map((item, index) => {
              const flipped = flippedIndex === index;
              return (
                <button
                  className={`coin ${flipped ? "coin--flipped" : ""}`}
                  type="button"
                  key={item.roman}
                  onClick={() => flipCoin(index)}
                  aria-label={`Глава ${item.roman}. ${flipped ? "Показать лицевую сторону" : "Показать обратную сторону"}`}
                  aria-pressed={flipped}
                >
                  <span className="coin__inner">
                    <span className="coin__face coin__face--front">
                      <img src="/coin-front.jpg" alt="" />
                      <strong>{item.roman}</strong>
                    </span>
                    <span className="coin__face coin__face--back">
                      <img src="/coin-back.jpg" alt="Обратная сторона загруженной монеты" />
                    </span>
                  </span>
                  {flipped && (
                    <span
                      className="coin__title"
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        openChapter(index);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          openChapter(index);
                        }
                      }}
                      aria-label={`Открыть главу ${item.roman}: ${item.title}`}
                    >
                      Открыть главу
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {scene === "chapter" && (
        <section className="scene reader scene--active">
          <div className="reader__topbar">
            <button className="text-button" type="button" onClick={returnToArena}>← К монетам</button>
            <span>{chapter ? `Глава ${chapter.roman} из V` : ""}</span>
          </div>

          {chapter && (
            <article className="scroll">
              <div className="scroll__rod scroll__rod--top" aria-hidden="true" />
              <div className="scroll__paper">
                <p className="chapter-card__roman">Глава {chapter.roman}</p>
                <h2>{chapter.title}</h2>
                <div className="chapter-card__rule" aria-hidden="true" />
                <div className="chapter-card__text">
                  {chapter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
                <footer className="chapter-card__footer">
                  {chapterIndex < chapters.length - 1 ? (
                    <button className="primary-button" type="button" onClick={returnToArena}>Вернуться к монетам</button>
                  ) : (
                    <button className="primary-button" type="button" onClick={() => setScene("purchase")}>Продолжить путешествие</button>
                  )}
                </footer>
              </div>
              <div className="scroll__rod scroll__rod--bottom" aria-hidden="true" />
            </article>
          )}
        </section>
      )}

      {scene === "purchase" && (
        <section className="scene purchase scene--active">
          <div className="purchase__glow" aria-hidden="true" />
          <div className="purchase__book" aria-hidden="true">
            <span>Современный<br />Колизей</span>
            <small>Гладиаторы успеха</small>
          </div>

          <div className="purchase__content">
            <p className="purchase__eyebrow">Первые пять глав пройдены</p>
            <h2>Путешествие продолжается</h2>
            <p>В полной версии читатель сможет продолжить путь по Колизею.</p>

            <div className="demo-notice">ДЕМО • настоящая оплата книги не подключена</div>

            <div className="payment-preview" aria-label="Демонстрация будущих способов оплаты">
              <div className="payment-card">
                <strong>СБП</strong>
                <span>Будущий способ оплаты</span>
              </div>
              <div className="payment-card payment-card--qr">
                <img className="real-qr" src="/sber-demo-qr.png" alt="Демонстрационный QR-код, открывающий СберБанк Онлайн" />
                <span>Сканируется телефоном</span>
                <small>Демо: открывает СберБанк Онлайн, но не создаёт платёж.</small>
              </div>
            </div>

            <button className="text-button" type="button" onClick={returnToArena}>← Вернуться к главам</button>
          </div>
        </section>
      )}
    </main>
  );
}
