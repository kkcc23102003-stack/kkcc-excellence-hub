import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { previewEasyText, easyTestSchema, type EasyQuestion } from "@/lib/easy-text-test";
import { publishEasyTextTest } from "@/lib/easy-text-test.functions";
const EXAMPLE = `Q1. What is 2 + 3?
A) 4
B) 5
C) 6
D) 7
Answer: B
Explanation: Adding 2 and 3 gives 5.

Q2. What is 10 - 4?
A) 6
B) 5
C) 4
D) 3
Answer: A
Explanation: Subtracting 4 from 10 gives 6.`;
export function EasyTextTestBuilder({ onPublished }: { onPublished: (id: string) => void }) {
  const publish = useServerFn(publishEasyTextTest);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [series, setSeries] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [priceInr, setPriceInr] = useState("0");
  const [priceCoins, setPriceCoins] = useState("0");
  const [minutes, setMinutes] = useState("30");
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<EasyQuestion[] | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const patch = (index: number, update: Partial<EasyQuestion>) =>
    setQuestions((current) => current!.map((q, i) => (i === index ? { ...q, ...update } : q)));
  const payload = () => ({
    id: id!,
    is_paid: isPaid,
    price_inr: isPaid ? Number(priceInr) : 0,
    price_coins: isPaid ? Number(priceCoins) : 0,
    title: title.trim() || `${subject} — ${chapter}`,
    subject,
    chapter,
    series_name: series,
    duration_minutes: Number(minutes),
    questions: questions || [],
  });
  const preview = () => {
    setError("");
    const result = previewEasyText(text);
    if (!subject.trim() || !chapter.trim()) {
      setError("Subject aur chapter likhein.");
      return;
    }
    if (!result.questions.length || result.incomplete) {
      setError(
        `${result.questions.length} valid questions mile; ${result.incomplete} incomplete. Har question ko Q1., Q2. se start karein aur options + Answer dein. Kuch bhi save nahi hua.`,
      );
      return;
    }
    const next = { ...payload(), id: crypto.randomUUID(), questions: result.questions };
    const check = easyTestSchema.safeParse(next);
    if (!check.success) {
      setError(check.error.issues[0]?.message || "Input check karein");
      return;
    }
    setId(next.id);
    setQuestions(result.questions);
    setStep(2);
  };
  const submit = async () => {
    if (!confirmed || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await publish({ data: easyTestSchema.parse(payload()) });
      onPublished(result.id);
      setStep(1);
      setText("");
      setQuestions(null);
      setId(null);
      setConfirmed(false);
      setTitle("");
      setIsPaid(false);
      setPriceInr("0");
      setPriceCoins("0");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed. Retry is safe.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="my-6 space-y-4 rounded-3xl border bg-card p-5">
      <h2 className="text-xl font-bold">Easy Text Test · {step}/3</h2>
      <p className="text-sm text-muted-foreground">
        Sirf aapke questions. Koi bank auto-fill nahi. Free ya Paid yahin select karein. 1
        mark/question, no negative marks; baaki settings Advanced mein available hain.
      </p>
      <details className="rounded border p-3 text-xs">
        <summary>First-time setup / save error?</summary>
        <p>
          Existing deployment: run the latest Publish Fix SQL once, then redeploy. No S3 required.
          Saved test/questions use Supabase; the template bank stays in project files.
        </p>
        <a className="underline" href="/KKCC-Excellence-Hub-PUBLISH-FIX.sql" download>
          Download Notes + Test Publish Fix SQL
        </a>
      </details>
      {error && (
        <p role="alert" className="rounded border border-destructive p-3 text-sm">
          {error}
        </p>
      )}
      {step === 1 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              Subject
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics / Punjabi"
              />
            </label>
            <label>
              Chapter
              <Input
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Fractions"
              />
            </label>
            <label>
              Test title (optional)
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              Series name / group (optional)
              <Input
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                placeholder="Existing series bundle access is not changed"
              />
            </label>
            <label>
              Time (minutes)
              <Input
                type="number"
                min={1}
                max={300}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </label>
          </div>
          <fieldset className="space-y-3 rounded-xl border p-4">
            <legend className="px-2 font-semibold">Test access & price</legend>
            <div className="flex gap-5">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="easy-access"
                  checked={!isPaid}
                  onChange={() => setIsPaid(false)}
                />
                Free
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="easy-access"
                  checked={isPaid}
                  onChange={() => setIsPaid(true)}
                />
                Paid
              </label>
            </div>
            {isPaid && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  Price (₹)
                  <Input
                    type="number"
                    min={0}
                    max={100000}
                    step={1}
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                  />
                </label>
                <label>
                  Coin price
                  <Input
                    type="number"
                    min={0}
                    max={1000000}
                    step={1}
                    value={priceCoins}
                    onChange={(e) => setPriceCoins(e.target.value)}
                  />
                </label>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  Kam se kam ek price 0 se zyada rakhein. Dono set karne par alternative payment
                  options honge, dono ek saath charge nahi honge. Razorpay OFF par rupee payment ke
                  liye Contact Admin; ON par existing online checkout. Coin access existing wallet
                  rules se milega.
                </p>
              </div>
            )}
          </fieldset>
          <details className="rounded border p-3">
            <summary>Paste ka format dekhein</summary>
            <pre className="whitespace-pre-wrap text-xs">{EXAMPLE}</pre>
            <p className="text-xs">
              Punjabi/Hindi/English question text chalega. Labels: Q1., A), B), Answer:,
              Explanation:. Explanation optional.
            </p>
          </details>
          <label className="block">
            Apne questions paste karein
            <Textarea
              aria-label="Your question text"
              rows={14}
              maxLength={500000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={EXAMPLE}
            />
          </label>
          <Button onClick={preview}>Preview questions — abhi save nahi hoga</Button>
        </>
      )}
      {step === 2 && (
        <>
          <p>
            {questions?.length} questions ready. Question, answer aur explanation check/edit kar lo.
          </p>
          <div className="max-h-[65vh] space-y-4 overflow-auto">
            {questions?.map((q, index) => (
              <div key={index} className="space-y-2 rounded-xl border p-3">
                <label>
                  Q{index + 1}
                  <Textarea
                    value={q.question_text}
                    onChange={(e) => patch(index, { question_text: e.target.value })}
                  />
                </label>
                {q.options.map((option, oi) => (
                  <label key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`easy-answer-${index}`}
                      aria-label={`Q${index + 1} correct answer ${String.fromCharCode(65 + oi)}`}
                      checked={q.correct_index === oi}
                      onChange={() => patch(index, { correct_index: oi })}
                    />
                    <span>{String.fromCharCode(65 + oi)}</span>
                    <Input
                      aria-label={`Q${index + 1} option ${oi + 1}`}
                      value={option}
                      onChange={(e) =>
                        patch(index, {
                          options: q.options.map((o, i) => (i === oi ? e.target.value : o)),
                        })
                      }
                    />
                  </label>
                ))}
                <label>
                  Explanation
                  <Textarea
                    value={q.explanation}
                    onChange={(e) => patch(index, { explanation: e.target.value })}
                  />
                </label>
                <Button
                  variant="outline"
                  onClick={() => setQuestions((current) => current!.filter((_, i) => i !== index))}
                >
                  Remove Q{index + 1}
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setStep(1)}>
            Back to paste
          </Button>{" "}
          <Button
            onClick={() => {
              const result = easyTestSchema.safeParse(payload());
              if (!result.success) {
                setError(result.error.issues[0]?.message || "Questions check karein");
                return;
              }
              setError("");
              setConfirmed(false);
              setStep(3);
            }}
          >
            Next → Review publish
          </Button>
        </>
      )}
      {step === 3 && (
        <>
          <h3 className="font-bold">{payload().title}</h3>
          <p>
            {subject} · {chapter} · {questions?.length} questions · {minutes} minutes ·{" "}
            {isPaid
              ? `Paid${Number(priceInr) > 0 ? ` · ₹${Number(priceInr)}` : ""}${Number(priceCoins) > 0 ? ` · ${Number(priceCoins)} coins` : ""}`
              : "Free"}
          </p>
          <p className="text-sm">
            {isPaid
              ? "Publish ke baad paid test locked rahega jab tak student ko valid access na mile."
              : "Publish ke baad ye free test students ko available hoga."}{" "}
            Yahi edited questions/options/explanations save honge. Series name sirf grouping hai;
            existing paid bundle se automatic link nahi hota.
          </p>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={confirmed}
              disabled={busy}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Maine questions aur correct answers check kar liye hain.
          </label>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => {
              setStep(2);
              setError("");
            }}
          >
            Back to questions
          </Button>{" "}
          <Button disabled={!confirmed || busy} onClick={() => void submit()}>
            {busy ? "Publishing…" : "Publish my test"}
          </Button>
        </>
      )}
    </section>
  );
}
