"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BagDiagram from "@/components/BagDiagram";
import { generateCore } from "@/lib/coreEngine";
import {
  ZONE_INFO,
  generateDesign,
  type GeneratedDesign,
  type Zone,
} from "@/lib/designEngine";
import {
  CONTEXT_TO_CORE_WORD,
  FOLLOW_UP_CHIPS,
  FOLLOW_UP_FALLBACK,
  FOLLOW_UP_REPLIES,
  FRUSTRATION_TIPS,
  GUARDRAIL_REPLY,
  HUMAN_REASONS,
  MAX_COMMENT_LENGTH,
  MAX_MESSAGE_LENGTH,
  QUESTIONS,
  SIZE_LABEL,
  classify,
  containsPii,
  followUpIntent,
  isOffTopicAnswer,
  parseContext,
  parseFrustration,
  parseItems,
  pickSize,
  sanitizeTester,
  sizeReason,
  type Context,
  type Frustration,
  type GuardrailCategory,
  type SizeId,
} from "@/lib/chatLogic";
import { supabase } from "@/lib/supabaseClient";

type Message = { id: number; role: "assistant" | "user"; text: string };

type Recommendation = {
  size: SizeId;
  reason: string;
  coreTitle: string;
  zoneLabel: string;
  principles: string[];
  tip: string;
  design: GeneratedDesign;
};

type Answers = {
  rawItems: string;
  ids: string[];
  custom: string[];
  context: Context;
  rawContext: string;
  frustration: Frustration;
  rawFrustration: string;
};

type Stats = {
  total_chats: number;
  selftest_chats: number;
  ratings_count: number;
  avg_rating: number | null;
};

const ZONE_ORDER: Zone[] = ["main", "front", "side", "inner"];

const GREETING =
  "Hi! I'm the Purse It bag advisor. I'll ask 3 quick questions, then recommend a bag size and layout.";

function intro(): Message[] {
  return [
    { id: 1, role: "assistant", text: GREETING },
    { id: 2, role: "assistant", text: QUESTIONS[0].text },
  ];
}

async function withTimeout<T>(request: PromiseLike<T>, ms = 6000): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([request, timeout]);
}

const chipClass =
  "rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-accent disabled:opacity-50";

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(intro);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [partial, setPartial] = useState<Partial<Answers>>({});
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [hits, setHits] = useState<GuardrailCategory[]>([]);
  const [humanReason, setHumanReason] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [humanState, setHumanState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [thumbs, setThumbs] = useState<"up" | "down" | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent" | "error" | "pii">("idle");
  const [stats, setStats] = useState<Stats | null>(null);

  const nextId = useRef(3);
  const sessionId = useRef<string | null>(null);
  const sessionSaved = useRef(false);
  const retries = useRef(0);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  async function loadStats() {
    if (!supabase) return;
    const result = await withTimeout(supabase.from("chat_stats").select("*").single());
    if (result && !result.error && result.data) setStats(result.data as Stats);
  }

  useEffect(() => {
    async function start() {
      await loadStats();
    }
    start();
  }, []);

  function getSessionId(): string {
    if (!sessionId.current) sessionId.current = crypto.randomUUID();
    return sessionId.current;
  }

  function testerTag(): string | null {
    try {
      return sanitizeTester(new URLSearchParams(window.location.search).get("t"));
    } catch {
      return null;
    }
  }

  function say(role: "assistant" | "user", text: string) {
    const id = nextId.current++;
    setMessages((prev) => [...prev, { id, role, text }]);
  }

  function recordHit(category: GuardrailCategory) {
    setHits((prev) => (prev.includes(category) ? prev : [...prev, category]));
  }

  function flagHuman(reason: string) {
    setHumanReason((current) => current ?? reason);
    if (sessionSaved.current && supabase) {
      void supabase
        .from("chat_feedback")
        .insert({ session_id: getSessionId(), wants_human: true });
    }
  }

  function restart() {
    setMessages(intro());
    nextId.current = 3;
    sessionId.current = null;
    sessionSaved.current = false;
    retries.current = 0;
    setStep(0);
    setPicked([]);
    setInput("");
    setPartial({});
    setRec(null);
    setHits([]);
    setHumanReason(null);
    setSaveState("idle");
    setHumanState("idle");
    setThumbs(null);
    setRating(0);
    setComment("");
    setFeedbackState("idle");
  }

  function handleGuardrail(category: GuardrailCategory, text: string) {
    recordHit(category);
    // Personal data is never echoed back or stored.
    say("user", category === "pii" ? "(message hidden: it looked like personal details)" : text);
    say("assistant", GUARDRAIL_REPLY[category]);
    if (category === "order") flagHuman(HUMAN_REASONS.order);
  }

  async function saveSession(answers: Answers, recommendation: Recommendation, hitList: GuardrailCategory[], reason: string | null) {
    if (!supabase) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    const { error } = await supabase.from("chat_sessions").insert({
      session_id: getSessionId(),
      tester: testerTag(),
      answers: {
        items: { ids: answers.ids, custom: answers.custom },
        context: answers.context,
        frustration: answers.frustration,
        raw: {
          items: answers.rawItems,
          context: answers.rawContext,
          frustration: answers.rawFrustration,
        },
      },
      recommendation: {
        size: recommendation.size,
        core: recommendation.coreTitle,
        zone: recommendation.zoneLabel,
      },
      guardrail_hits: hitList,
      needs_human: reason !== null,
      human_reason: reason,
    });
    sessionSaved.current = !error;
    setSaveState(error ? "error" : "saved");
    if (!error) void loadStats();
  }

  function finish(answers: Answers) {
    const count = answers.ids.length + answers.custom.length;
    const hasLaptop = answers.ids.includes("laptop");
    const size = pickSize(count, hasLaptop, answers.context);
    const core = generateCore(`${answers.rawItems} ${CONTEXT_TO_CORE_WORD[answers.context]}`);
    const design = generateDesign(size, answers.ids, answers.custom.join(", "));
    const recommendation: Recommendation = {
      size,
      reason: sizeReason(count, hasLaptop, answers.context, size),
      coreTitle: core.title,
      zoneLabel: core.zoneLabel,
      principles: core.principles.slice(0, 2),
      tip: FRUSTRATION_TIPS[answers.frustration],
      design,
    };
    let reason = humanReason;
    if (count === 0 && !reason) {
      reason = HUMAN_REASONS.low_confidence;
      setHumanReason(reason);
    }
    setRec(recommendation);
    setStep(3);
    say(
      "assistant",
      `Here's my recommendation: a ${SIZE_LABEL[size]} bag, built around "${core.title}". Details below.${
        count === 0 ? " I couldn't recognize your items, so this is a general suggestion." : ""
      }`
    );
    void saveSession(answers, recommendation, hits, reason);
  }

  function acceptAnswer(text: string) {
    say("user", text);

    if (step === 0) {
      const parsed = parseItems(text);
      if (parsed.ids.length + parsed.custom.length === 0 && retries.current < 1) {
        retries.current += 1;
        say("assistant", "I didn't catch any items. Try something like: laptop, keys, charger.");
        return;
      }
      setPartial({ rawItems: text, ids: parsed.ids, custom: parsed.custom });
      setPicked([]);
      setStep(1);
      say("assistant", QUESTIONS[1].text);
      return;
    }

    if (step === 1) {
      setPartial((prev) => ({ ...prev, rawContext: text, context: parseContext(text) }));
      setStep(2);
      say("assistant", QUESTIONS[2].text);
      return;
    }

    const answers: Answers = {
      rawItems: partial.rawItems ?? "",
      ids: partial.ids ?? [],
      custom: partial.custom ?? [],
      context: partial.context ?? "everywhere",
      rawContext: partial.rawContext ?? "",
      frustration: parseFrustration(text),
      rawFrustration: text,
    };
    finish(answers);
  }

  function submit(raw: string) {
    const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text) return;
    setInput("");

    const category = classify(text);
    if (category !== "ok") {
      handleGuardrail(category, text);
      if (step < 3) say("assistant", QUESTIONS[step].text);
      return;
    }

    if (step < 3) {
      if (isOffTopicAnswer(text)) {
        recordHit("off_topic");
        say("user", text);
        say("assistant", GUARDRAIL_REPLY.off_topic);
        say("assistant", QUESTIONS[step].text);
        return;
      }
      acceptAnswer(text);
      return;
    }

    // Follow-up questions after the recommendation.
    say("user", text);
    const intent = followUpIntent(text);
    if (intent === "restart") {
      restart();
      return;
    }
    if (intent === "none") {
      if (isOffTopicAnswer(text) || text.split(/\s+/).length >= 4) {
        recordHit("off_topic");
        say("assistant", GUARDRAIL_REPLY.off_topic);
      } else {
        say("assistant", FOLLOW_UP_FALLBACK);
      }
      return;
    }
    say("assistant", FOLLOW_UP_REPLIES[intent]);
  }

  async function sendHumanRequest() {
    if (!supabase || !sessionSaved.current) {
      setHumanState("error");
      return;
    }
    setHumanState("sending");
    const { error } = await supabase
      .from("chat_feedback")
      .insert({ session_id: getSessionId(), wants_human: true });
    setHumanState(error ? "error" : "sent");
    if (!error) setHumanReason((current) => current ?? HUMAN_REASONS.user_request);
  }

  async function sendFeedback() {
    if (!thumbs && rating === 0) return;
    if (comment.trim() && containsPii(comment)) {
      setFeedbackState("pii");
      return;
    }
    if (!supabase || !sessionSaved.current) {
      setFeedbackState("error");
      return;
    }
    setFeedbackState("sending");
    const { error } = await supabase.from("chat_feedback").insert({
      session_id: getSessionId(),
      thumbs,
      rating: rating || null,
      comment: comment.trim() ? comment.trim().slice(0, MAX_COMMENT_LENGTH) : null,
    });
    setFeedbackState(error ? "error" : "sent");
    if (!error) void loadStats();
  }

  const question = step < 3 ? QUESTIONS[step] : null;
  const external = stats ? stats.total_chats - stats.selftest_chats : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Bag advisor</h2>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              Guided assistant · rule-based, not AI
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Please don&apos;t share personal details. Your answers are saved without your name.
          </p>

          {question && (
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-accent">
              Question {step + 1} of 3
            </p>
          )}

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="mt-3 h-80 space-y-3 overflow-y-auto rounded-xl border border-border bg-background p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-surface"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          {question && (
            <div className="mt-4">
              <p className="text-xs text-muted">{question.hint}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {question.chips.map((chip) =>
                  question.multi ? (
                    <button
                      key={chip}
                      type="button"
                      aria-pressed={picked.includes(chip)}
                      onClick={() =>
                        setPicked((prev) =>
                          prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]
                        )
                      }
                      className={`${chipClass} ${picked.includes(chip) ? "border-accent bg-accent/10" : ""}`}
                    >
                      {chip}
                    </button>
                  ) : (
                    <button key={chip} type="button" onClick={() => submit(chip)} className={chipClass}>
                      {chip}
                    </button>
                  )
                )}
                {question.multi && (
                  <button
                    type="button"
                    disabled={picked.length === 0}
                    onClick={() => submit(picked.join(", "))}
                    className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    That&apos;s everything
                  </button>
                )}
              </div>
            </div>
          )}

          {rec && (
            <div className="mt-4 flex flex-wrap gap-2">
              {FOLLOW_UP_CHIPS.map((chip) => (
                <button key={chip} type="button" onClick={() => submit(chip)} className={chipClass}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submit(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Your message
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(event) => setInput(event.target.value)}
              placeholder={rec ? "Ask a follow-up..." : "Or type your answer..."}
              autoComplete="off"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Send
            </button>
          </form>
        </section>

        {rec && (
          <section className="rounded-2xl border border-border bg-surface p-6" aria-label="Recommendation">
            <h2 className="text-lg font-semibold">Your recommendation</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-[220px_1fr]">
              <BagDiagram design={rec.design} />
              <div>
                <p className="text-base font-semibold">{SIZE_LABEL[rec.size]} bag</p>
                <p className="mt-1 text-sm text-muted">{rec.reason}</p>
                <p className="mt-4 text-sm font-medium">
                  {rec.coreTitle} · Priority zone: {rec.zoneLabel}
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  {rec.principles.map((principle) => (
                    <li key={principle}>{principle}</li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2">
                  {ZONE_ORDER.filter((zone) => rec.design.zones[zone].length > 0).map((zone) => (
                    <li key={zone} className="text-sm">
                      <span className="font-medium">{ZONE_INFO[zone].label}:</span>{" "}
                      <span className="text-muted">{rec.design.zones[zone].join(", ")}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm">
                  <span className="font-medium">Tip:</span> <span className="text-muted">{rec.tip}</span>
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/#disenar"
                    className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    Open the bag designer
                  </Link>
                  <Link
                    href="/core"
                    className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-background"
                  >
                    See my design core
                  </Link>
                </div>
              </div>
            </div>
            {saveState === "error" && (
              <p role="status" className="mt-4 text-xs text-muted">
                This chat couldn&apos;t be saved because the database didn&apos;t respond. Your
                recommendation is still here.
              </p>
            )}
          </section>
        )}

        {rec && (
          <section className="rounded-2xl border border-border bg-surface p-6" aria-label="Human review">
            <h2 className="text-lg font-semibold">Human review</h2>
            <p className="mt-1 text-sm text-muted">
              Want a person to look at this chat? Flag it and the Purse It team will review it to
              improve the advisor. We can&apos;t reply, because we don&apos;t collect contact details.
            </p>
            {humanReason && humanState !== "sent" && (
              <p role="status" className="mt-3 text-sm">
                This chat is already marked for human review.
              </p>
            )}
            <button
              type="button"
              onClick={sendHumanRequest}
              disabled={humanState === "sending" || humanState === "sent"}
              className="mt-4 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-background disabled:opacity-50"
            >
              {humanState === "sent" ? "Flagged for human review" : "Flag for human review"}
            </button>
            {humanState === "sent" && (
              <p role="status" className="mt-3 text-sm text-muted">
                Flagged. A person will review this chat.
              </p>
            )}
            {humanState === "error" && (
              <p role="status" className="mt-3 text-sm text-muted">
                Couldn&apos;t flag it because the database didn&apos;t respond.
              </p>
            )}
          </section>
        )}

        {rec && (
          <section className="rounded-2xl border border-border bg-surface p-6" aria-label="Feedback">
            <h2 className="text-lg font-semibold">Was this helpful?</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-pressed={thumbs === "up"}
                onClick={() => setThumbs("up")}
                className={`${chipClass} ${thumbs === "up" ? "border-accent bg-accent/10" : ""}`}
              >
                Thumbs up
              </button>
              <button
                type="button"
                aria-pressed={thumbs === "down"}
                onClick={() => setThumbs("down")}
                className={`${chipClass} ${thumbs === "down" ? "border-accent bg-accent/10" : ""}`}
              >
                Thumbs down
              </button>
              <div role="group" aria-label="Rating from 1 to 5" className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={rating === value}
                    aria-label={`${value} out of 5`}
                    onClick={() => setRating(value)}
                    className={`h-9 w-9 rounded-full border text-sm font-medium transition-colors ${
                      rating >= value ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <label className="mt-4 block text-sm font-medium" htmlFor="chat-comment">
              Anything we should improve? (optional)
            </label>
            <textarea
              id="chat-comment"
              value={comment}
              maxLength={MAX_COMMENT_LENGTH}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <p className="mt-1 text-xs text-muted">
              {comment.length}/{MAX_COMMENT_LENGTH}. Please don&apos;t include personal details.
            </p>
            <button
              type="button"
              onClick={sendFeedback}
              disabled={(!thumbs && rating === 0) || feedbackState === "sending" || feedbackState === "sent"}
              className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {feedbackState === "sent" ? "Feedback sent" : "Send feedback"}
            </button>
            {feedbackState === "sent" && (
              <p role="status" className="mt-3 text-sm text-muted">Thanks! Your feedback was saved.</p>
            )}
            {feedbackState === "pii" && (
              <p role="status" className="mt-3 text-sm text-muted">
                Your comment looks like it has personal details (an email, phone, or card number).
                Please remove them and send again.
              </p>
            )}
            {feedbackState === "error" && (
              <p role="status" className="mt-3 text-sm text-muted">
                Couldn&apos;t save your feedback because the database didn&apos;t respond.
              </p>
            )}
          </section>
        )}
      </div>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold">What gets saved</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted">
            <li>Your 3 answers</li>
            <li>The recommendation</li>
            <li>Your rating and comment</li>
            <li>Whether the chat was flagged</li>
            <li>Which guardrails triggered</li>
          </ul>
          <p className="mt-3 text-xs text-muted">
            Nothing is saved with your name. Saved chats are write-only: visitors can&apos;t read each
            other&apos;s chats.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold">How it decides</h2>
          <p className="mt-2 text-sm text-muted">
            Simple rules, not a language model. The size comes from how many items you carry (Mini up
            to 3, Medium 4 to 6, Large 7 or more), adjusted for a laptop or a travel or sports day.
            It stays on the topic of bags and says so when a request is outside that.
          </p>
        </section>

        {stats && external !== null && (
          <section className="rounded-2xl border border-border bg-surface p-6" aria-label="Live numbers">
            <h2 className="text-base font-semibold">Live numbers</h2>
            <p className="mt-2 text-sm text-muted tabular-nums">
              {external} chat{external === 1 ? "" : "s"} so far
              {stats.ratings_count > 0 && stats.avg_rating !== null
                ? ` · ${stats.ratings_count} rating${stats.ratings_count === 1 ? "" : "s"}, average ${stats.avg_rating}/5`
                : ""}
            </p>
          </section>
        )}
      </aside>
    </div>
  );
}
