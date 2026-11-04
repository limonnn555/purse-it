import ChatAssistant from "@/components/ChatAssistant";

export const metadata = {
  title: "Chat — Purse It",
  description:
    "The Purse It bag advisor: answer 3 quick questions and get a recommended bag size and layout.",
};

export default function ChatPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Bag advisor
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">
        Not sure which bag fits your day? Answer 3 questions.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        A guided assistant that recommends a bag size and layout from what you
        carry, where you go, and what bugs you about your current bag. It uses
        simple rules, not AI, and it tells you when something is outside what
        it can help with.
      </p>

      <div className="mt-10">
        <ChatAssistant />
      </div>
    </div>
  );
}
