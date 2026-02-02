import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = [
  {
    q: "Is this tool free?",
    a: "This UI is free to use. The backend API is provided by a third party and may have limits or downtime.",
  },
  {
    q: "Why do some links return no options?",
    a: "Some platforms restrict downloads, and not every post/video exposes downloadable media via the API.",
  },
  {
    q: "Do you store my links?",
    a: "Recent downloads are saved only on your device (local storage). You can clear them anytime.",
  },
  {
    q: "Is this legal?",
    a: "Use it for personal content and respect platform rules and copyrights. You are responsible for compliance.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24 space-y-4">
      <header className="space-y-1">
        <h2 className="font-display text-xl font-semibold">FAQ</h2>
        <p className="text-sm text-muted-foreground">Quick answers to common questions.</p>
      </header>

      <Card className="shadow-elev">
        <CardContent className="p-2">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="px-4 text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
