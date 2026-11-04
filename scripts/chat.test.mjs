import test from "node:test";
import assert from "node:assert/strict";
import {
  QUESTIONS,
  classify,
  containsPii,
  followUpIntent,
  isOffTopicAnswer,
  parseContext,
  parseFrustration,
  parseItems,
  pickSize,
  sanitizeTester,
} from "../src/lib/chatLogic.ts";

test("guardrails catch personal data, abuse, advice, and order requests, but let normal answers through", () => {
  assert.equal(classify("my email is ana@example.com"), "pii");
  assert.equal(classify("call me at 55 1234 5678"), "pii");
  assert.equal(classify("my password is hunter2"), "pii");
  assert.equal(classify("you are stupid"), "abuse");
  assert.equal(classify("should I see a doctor about my back"), "advice");
  assert.equal(classify("can you recommend a good lawyer"), "advice");
  assert.equal(classify("how much does it cost?"), "order");
  assert.equal(classify("I want to order one"), "order");

  // Every chip a visitor can tap must pass cleanly.
  for (const question of QUESTIONS) {
    for (const chip of question.chips) assert.equal(classify(chip), "ok", chip);
  }
  assert.equal(classify("laptop, phone, keys and charger"), "ok");
  assert.equal(containsPii("I carry 3 items"), false);
});

test("answers are parsed into items, context, and frustration, and the size follows the rules", () => {
  const items = parseItems("Laptop, phone, keys and charger");
  assert.deepEqual(items.ids.sort(), ["cargador", "celular", "laptop", "llaves"]);
  assert.deepEqual(items.custom, []);
  assert.deepEqual(parseItems("umbrella, laptop"), { ids: ["laptop"], custom: ["umbrella"] });
  assert.deepEqual(parseItems("Water bottle, Notebook").ids.sort(), ["botella", "libreta"]);

  assert.equal(parseContext("Gym or sports"), "gym");
  assert.equal(parseContext("Office, I bike to work"), "office");
  assert.equal(parseContext("Everywhere"), "everywhere");
  assert.equal(parseFrustration("Can't find things"), "cant_find");
  assert.equal(parseFrustration("Too heavy"), "too_heavy");
  assert.equal(parseFrustration("Things get damaged"), "damaged");
  assert.equal(parseFrustration("Looks messy"), "messy");
  assert.equal(parseFrustration("I just want a nicer one"), "other");

  assert.equal(pickSize(3, false, "office"), "mini");
  assert.equal(pickSize(3, true, "office"), "mediana"); // a laptop does not fit a mini bag
  assert.equal(pickSize(5, false, "gym"), "mediana");
  assert.equal(pickSize(7, false, "everywhere"), "grande");
  assert.equal(pickSize(2, false, "travel"), "mediana");
});

test("off-topic sentences are caught, short answers are kept, follow-ups are routed, and tester tags are cleaned", () => {
  assert.equal(isOffTopicAnswer("what is the weather like in paris today"), true);
  assert.equal(isOffTopicAnswer("umbrella"), false);
  assert.equal(isOffTopicAnswer("laptop and a charger"), false);

  assert.equal(followUpIntent("Why this size?"), "size");
  assert.equal(followUpIntent("Where do my keys go?"), "organizer");
  assert.equal(followUpIntent("What's the front pocket for?"), "front");
  assert.equal(followUpIntent("Start over"), "restart");
  assert.equal(followUpIntent("tell me a joke"), "none");

  assert.equal(sanitizeTester("Maria!"), "maria");
  assert.equal(sanitizeTester("../../x"), "x");
  assert.equal(sanitizeTester(null), null);
  assert.equal(sanitizeTester("a".repeat(40)).length, 20);
});
