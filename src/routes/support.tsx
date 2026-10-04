import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/kkcc/site-layout";
import { useWebsiteContent } from "@/components/kkcc/website-content-provider";
import { CustomPageSections } from "@/components/kkcc/custom-page-sections";
import { RazorpayPaymentRecovery } from "@/components/kkcc/razorpay-payment-recovery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/data/kkcc";
import { submitAdmissionEnquiry } from "@/lib/enquiries.functions";
import { friendlyError } from "@/lib/storage";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Contact — Kusum Kartik Coaching Centre" },
      {
        name: "description",
        content:
          "Contact Kusum Kartik Coaching Centre for admissions, batch enquiries and student support, or read frequently asked questions.",
      },
      { property: "og:title", content: "Support & Contact — KKCC" },
      {
        property: "og:description",
        content: "Admissions help, batch enquiries and student support.",
      },
    ],
  }),
  component: SupportPage,
});

const schema = z.object({
  name: z.string().trim().min(2, { message: "Enter your name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  phone: z.string().trim().max(30),
  class_level: z.string().trim().max(80),
  interest: z.string().trim().max(120),
  message: z.string().trim().min(10, { message: "Tell us a bit more" }).max(2000),
});

const CONTACT_ICONS = [Phone, Mail, MapPin] as const;

function SupportPage() {
  const content = useWebsiteContent();
  const sendEnquiry = useServerFn(submitAdmissionEnquiry);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    class_level: "",
    interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const enquiryMutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) =>
      sendEnquiry({ data: { ...data, source: "support" } }),
    onSuccess: () => {
      setValues({ name: "", email: "", phone: "", class_level: "", interest: "", message: "" });
      toast.success(content.support.message_success_title, {
        description: content.support.message_success_description,
      });
    },
    onError: (error: Error) => toast.error(friendlyError(error)),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (next[String(i.path[0])] = i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    enquiryMutation.mutate(parsed.data);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow={content.page_headers.support.eyebrow}
        title={content.page_headers.support.title}
        description={content.page_headers.support.description}
      />

      <CustomPageSections page="support" position="top" />

      {/* Online payment made but access missing: recover it here, no waiting. */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6">
        <RazorpayPaymentRecovery />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <MessageSquare className="h-5 w-5 text-primary" /> {content.support.form_title}
          </h2>
          <form onSubmit={submit} className="surface-panel mt-5 space-y-4 p-6" noValidate>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                aria-invalid={!!errors["name"]}
                className="mt-1.5"
              />
              {errors["name"] && <p className="mt-1 text-xs text-destructive">{errors["name"]}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                aria-invalid={!!errors["email"]}
                className="mt-1.5"
              />
              {errors["email"] && (
                <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input
                  id="phone"
                  value={values.phone}
                  onChange={(e) => setValues({ ...values, phone: e.target.value })}
                  aria-invalid={!!errors["phone"]}
                  className="mt-1.5"
                  placeholder="Optional"
                />
                {errors["phone"] && (
                  <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="class_level">Class / target</Label>
                <Input
                  id="class_level"
                  value={values.class_level}
                  onChange={(e) => setValues({ ...values, class_level: e.target.value })}
                  aria-invalid={!!errors["class_level"]}
                  className="mt-1.5"
                  placeholder="Class 10, NEET, CUET..."
                />
                {errors["class_level"] && (
                  <p className="mt-1 text-xs text-destructive">{errors["class_level"]}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="interest">Interested batch/course</Label>
              <Input
                id="interest"
                value={values.interest}
                onChange={(e) => setValues({ ...values, interest: e.target.value })}
                aria-invalid={!!errors["interest"]}
                className="mt-1.5"
                placeholder="Example: Class 11 Science batch"
              />
              {errors["interest"] && (
                <p className="mt-1 text-xs text-destructive">{errors["interest"]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                aria-invalid={!!errors["message"]}
                className="mt-1.5"
              />
              {errors["message"] && (
                <p className="mt-1 text-xs text-destructive">{errors["message"]}</p>
              )}
            </div>
            <Button type="submit" className="rounded-full" disabled={enquiryMutation.isPending}>
              {enquiryMutation.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {content.support.submit_label}
            </Button>
          </form>

          <div className="mt-6 grid gap-3">
            {content.support.contacts.map((c, index) => {
              const Icon = CONTACT_ICONS[index] ?? Phone;
              return (
                <div key={c.label} className="surface-panel flex items-center gap-3 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{c.label}</span>
                    <span className="block truncate text-sm font-medium">{c.value}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">Help & contact</h2>
          <div className="surface-panel mt-5 p-6 text-sm text-muted-foreground">
            Send your admission, batch or platform question from the form. The message is saved in
            the KKCC support inbox, so the team can reply and track your request.
          </div>
          {FAQS.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-bold">{content.support.faq_title}</h3>
              <Accordion type="single" collapsible className="mt-5">
                {FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}
        </section>
      </div>
      <CustomPageSections page="support" position="bottom" />
    </SiteLayout>
  );
}
