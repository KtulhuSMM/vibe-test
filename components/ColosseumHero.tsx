"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/data/chapters";

type Scene = "hero" | "arena" | "chapter" | "purchase";

const SBER_DEMO_URL = "https://online.sberbank.ru/";

export function ColosseumHero() {
  const [scene, setScene] = useState<Scene>("hero");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  const chapter = chapters[chapterIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQrOpen(false);
  }, [scene, chapterIndex]);

  useEffect(() => {
    if (!qrOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setQrOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [qrOpen]);

  function enterArena() {
    setFlippedIndex(null);
    setScene("arena");
  }

  function returnToHero() {
    setFlippedIndex(null);
    setScene("hero");
  }

  function openChapter(index: number) {
    setChapterIndex(index);
    setScene("chapter");
  }

  function flipCoin(index: number) {
    setFlippedIndex((current) => current === index ? null : index);
  }

  function returnToArena() {
    setFlippedIndex(null);
    setScene("arena");
  }

  function openSberDemo() {
    window.open(SBER_DEMO_URL, "_blank", "noopener,noreferrer");
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
          <img
            className="arena__background"
            src="/arena-gladiators.jpg"
            alt="Гладиаторы сражаются на арене перед заполненными трибунами на закате"
            style={{
              filter: "saturate(1.08) contrast(1.14) brightness(.95)",
              transform: "none",
              imageRendering: "auto",
            }}
          />
          <div className="arena__shade" aria-hidden="true" />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              background: "radial-gradient(circle at 72% 4%, rgba(255,158,54,.26), transparent 34%), linear-gradient(180deg, rgba(170,70,15,.08), transparent 48%)",
              mixBlendMode: "screen",
            }}
          />

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

          <button
            type="button"
            onClick={returnToHero}
            aria-label="Вернуться на первую страницу"
            title="Вернуться на первую страницу"
            style={{
              position: "absolute",
              left: "clamp(14px, 2vw, 28px)",
              bottom: "clamp(14px, 2vw, 26px)",
              zIndex: 8,
              width: "82px",
              height: "44px",
              padding: 0,
              border: 0,
              background: "transparent",
              cursor: "pointer",
              filter: "drop-shadow(0 4px 7px rgba(0,0,0,.7))",
            }}
          >
            <svg viewBox="0 0 100 44" width="82" height="44" aria-hidden="true">
              <defs>
                <linearGradient id="redSpear" x1="0" x2="1">
                  <stop offset="0" stopColor="#57140e" />
                  <stop offset=".55" stopColor="#b42a1c" />
                  <stop offset="1" stopColor="#64120d" />
                </linearGradient>
              </defs>
              <path d="M96 22 71 8l6 10H24v8h53l-6 10Z" fill="url(#redSpear)" stroke="#e06a43" strokeWidth="1.5" />
              <rect x="7" y="18" width="22" height="8" rx="4" fill="#72170f" stroke="#d45532" strokeWidth="1.2" />
            </svg>
            <span className="sr-only">Вернуться на первую страницу</span>
          </button>
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
                <button
                  type="button"
                  onClick={() => setQrOpen(true)}
                  aria-label="Увеличить QR-код СберБанк Онлайн"
                  title="Нажмите, чтобы увеличить QR-код"
                  style={{ border: 0, padding: 0, background: "transparent", cursor: "zoom-in", borderRadius: 8 }}
                >
                  <img className="real-qr" src="/sber-demo-qr.png" alt="Демонстрационный QR-код, открывающий СберБанк Онлайн" />
                </button>
                <span>Нажмите на QR-код, чтобы увеличить</span>
                <small>Демо: QR открывает СберБанк Онлайн без автоматического списания.</small>
              </div>
            </div>

            <button className="text-button" type="button" onClick={returnToArena}>← Вернуться к главам</button>
          </div>

          {qrOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Увеличенный QR-код СберБанк Онлайн"
              onClick={() => setQrOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "grid",
                placeItems: "center",
                padding: 20,
                background: "rgba(0,0,0,.82)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  maxWidth: "94vw",
                  padding: 18,
                  border: "1px solid rgba(240,208,146,.35)",
                  borderRadius: 18,
                  background: "#120b07",
                  boxShadow: "0 24px 80px rgba(0,0,0,.7)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setQrOpen(false)}
                  aria-label="Закрыть увеличенный QR-код"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    width: 34,
                    height: 34,
                    border: 0,
                    borderRadius: 999,
                    background: "rgba(0,0,0,.65)",
                    color: "#fff",
                    fontSize: 22,
                    lineHeight: 1,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>

                <img
                  src="/sber-demo-qr.png"
                  alt="Увеличенный QR-код для открытия СберБанк Онлайн"
                  style={{
                    width: "min(528px, 84vw)",
                    height: "auto",
                    display: "block",
                    background: "#fff",
                    padding: 28,
                    borderRadius: 16,
                    imageRendering: "pixelated",
                  }}
                />

                <button className="primary-button" type="button" onClick={openSberDemo}>
                  Открыть тестовый перевод в СберБанк Онлайн
                </button>
                <small style={{ maxWidth: 520, textAlign: "center", color: "#bca98a", font: "600 .72rem/1.4 system-ui,sans-serif" }}>
                  Это демонстрационный переход: сумма и получатель не заданы, списание не выполняется автоматически.
                </small>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
