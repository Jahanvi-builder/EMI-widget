"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";
import { BANK_OPTIONS, EMI_PLANS, type BankCode, type EmiPlan, formatInr, ORDER } from "@/lib/emi-data";

type Message = {
  id: string;
  role: "agent" | "user";
  text: string;
  time: string;
};

function nowLabel(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function EmiChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentBank, setCurrentBank] = React.useState<BankCode | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<(EmiPlan & { bank: BankCode }) | null>(null);
  const [showBankOptions, setShowBankOptions] = React.useState(false);
  const [showPlanOptions, setShowPlanOptions] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [paid, setPaid] = React.useState(false);

  const addMessage = React.useCallback((role: "agent" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text, time: nowLabel() }]);
  }, []);

  const startConversation = React.useCallback(() => {
    setTimeout(() => {
      addMessage(
        "agent",
        `Hi! I'm Priya from Pine Labs.\nFor ${ORDER.name}, I can quickly help you choose an EMI plan.\nWhich bank card do you usually use?`,
      );
      setShowBankOptions(true);
    }, 250);
  }, [addMessage]);

  React.useEffect(() => {
    if (open && messages.length === 0) startConversation();
  }, [open, messages.length, startConversation]);

  const pickBank = (bank: BankCode | "OTHER") => {
    setShowBankOptions(false);
    if (bank === "OTHER") {
      addMessage("user", "I have a different bank");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "agent",
          "No problem. Eligibility varies by card.\nYou can still continue and see exact options securely at checkout.\nWould you like a sample plan preview?",
        );
      }, 700);
      return;
    }

    setCurrentBank(bank);
    addMessage("user", `${bank} card`);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const plans = EMI_PLANS[bank];
      const popular = plans.find((plan) => plan.popular);
      if (popular) {
        addMessage(
          "agent",
          `Great. ${bank} has ${plans.length} EMI options.\nMost customers choose ${popular.tenure} months at ${formatInr(popular.monthly)}/month.\nPick your preferred plan below.`,
        );
      } else {
        addMessage("agent", `Here are all available ${bank} EMI plans.`);
      }
      setShowPlanOptions(true);
    }, 900);
  };

  const pickPlan = (plan: EmiPlan) => {
    if (!currentBank) return;
    setShowPlanOptions(false);
    setSelectedPlan({ ...plan, bank: currentBank });
    addMessage("user", `${plan.tenure} months at ${formatInr(plan.monthly)}/month`);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const totalWithoutFee = plan.monthly * plan.tenure;
      const extra = totalWithoutFee - ORDER.amount;
      if (plan.interestRate === 0) {
        addMessage("agent", `Perfect choice. You pay exactly ${formatInr(ORDER.amount)} with zero interest.`);
      } else {
        addMessage(
          "agent",
          `Good pick. Total repayment is ${formatInr(totalWithoutFee)} (extra ${formatInr(extra)} over base amount).`,
        );
      }
    }, 700);
  };

  const simulatePay = () => {
    if (!selectedPlan) return;
    setPaid(true);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping || paid) return;
    setInput("");
    addMessage("user", text);
    setIsTyping(true);

    window.setTimeout(() => {
      const lower = text.toLowerCase();
      setIsTyping(false);
      if (lower.includes("safe") || lower.includes("secure")) {
        addMessage("agent", "Yes. Card details are entered only on Pine Labs secure checkout, never inside this chat.");
        return;
      }
      if (lower.includes("return")) {
        addMessage("agent", "Return policy is 30 days. If cancelled, remaining EMI instalments are auto-closed.");
        return;
      }
      if (lower.includes("best") || lower.includes("recommend")) {
        if (!currentBank) {
          addMessage("agent", "Share your bank name and I can recommend the best EMI option.");
          setShowBankOptions(true);
          return;
        }
        const plan = EMI_PLANS[currentBank].find((p) => p.popular) ?? EMI_PLANS[currentBank][0];
        addMessage(
          "agent",
          `For ${currentBank}, the most popular option is ${plan.tenure} months at ${formatInr(plan.monthly)}/month.`,
        );
        setShowPlanOptions(true);
        return;
      }
      addMessage("agent", "I can help with EMI plans, fees, safety, and return policy. Tell me your bank to continue.");
    }, 650);
  };

  const totalPayable = selectedPlan
    ? selectedPlan.monthly * selectedPlan.tenure + selectedPlan.processingFee
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="w-full max-w-xl cursor-pointer border-2 transition hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pay At Your Pace</CardTitle>
            <CardDescription>EMI from {formatInr(6249)}/month. Setup in ~30 seconds.</CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Chat to compare plans</span>
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Pine Labs secured
            </Badge>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[420px]">
        <DialogHeader className="border-b bg-muted/40 px-4 py-3">
          <DialogTitle className="text-sm">Priya • EMI Advisor</DialogTitle>
          <DialogDescription className="flex items-center justify-between text-xs">
            <span>{ORDER.name}</span>
            <span className="font-medium text-foreground">{formatInr(ORDER.amount)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="border-b bg-amber-50 px-4 py-2 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          This chat helps compare EMI plans only. No card number, CVV, or OTP is collected here.
        </div>

        {paid && selectedPlan ? (
          <div className="p-4">
            <Card>
              <CardHeader className="items-center text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <CardTitle className="text-lg">Payment Confirmed</CardTitle>
                <CardDescription>Checkout completed with your selected EMI plan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Order</span><span>{ORDER.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span>{selectedPlan.bank}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Monthly EMI</span><span>{formatInr(selectedPlan.monthly)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tenure</span><span>{selectedPlan.tenure} months</span></div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[430px] px-3 py-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={message.role === "user" ? "ml-auto max-w-[88%]" : "max-w-[88%]"}>
                    <div
                      className={
                        message.role === "user"
                          ? "rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                          : "rounded-2xl rounded-bl-sm border bg-card px-3 py-2 text-sm"
                      }
                    >
                      {message.text.split("\n").map((line, idx) => (
                        <React.Fragment key={`${message.id}-${idx}`}>
                          {idx > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="mt-1 px-1 text-[10px] text-muted-foreground">{message.time}</div>
                  </div>
                ))}

                {isTyping && (
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm border bg-card px-3 py-2 text-xs text-muted-foreground">
                    Priya is typing...
                  </div>
                )}

                {showBankOptions && (
                  <div className="flex flex-wrap gap-2">
                    {BANK_OPTIONS.map((bank) => (
                      <Button
                        key={bank}
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                        onClick={() => pickBank(bank)}
                      >
                        {bank === "OTHER" ? "Other bank" : bank}
                      </Button>
                    ))}
                  </div>
                )}

                {showPlanOptions && currentBank && (
                  <div className="space-y-2">
                    {EMI_PLANS[currentBank].map((plan) => (
                      <button
                        key={`${currentBank}-${plan.tenure}`}
                        type="button"
                        onClick={() => pickPlan(plan)}
                        className="w-full rounded-xl border bg-card p-3 text-left transition hover:border-primary/60 hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold">{formatInr(plan.monthly)}</div>
                          <div className="text-xs text-muted-foreground">x {plan.tenure} months</div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge variant="outline">{plan.label}</Badge>
                          <Badge variant="outline">{plan.processingFee ? `${formatInr(plan.processingFee)} fee` : "No fee"}</Badge>
                          {plan.popular && <Badge>Popular</Badge>}
                          {plan.offer && <Badge variant="secondary">{plan.offer}</Badge>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedPlan && (
                  <Card className="mt-3">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Your EMI Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span>{selectedPlan.bank}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Monthly</span><span>{formatInr(selectedPlan.monthly)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Tenure</span><span>{selectedPlan.tenure} months</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Interest</span><span>{selectedPlan.interestRate === 0 ? "Zero" : `${selectedPlan.interestRate}% p.a.`}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Processing fee</span><span>{selectedPlan.processingFee ? formatInr(selectedPlan.processingFee) : "None"}</span></div>
                      <Separator />
                      <div className="flex justify-between font-medium"><span>Total payable</span><span>{formatInr(totalPayable)}</span></div>
                    </CardContent>
                    <CardFooter className="grid gap-2">
                      <Button onClick={simulatePay}>Pay Now • Pine Labs Checkout</Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedPlan(null);
                          setShowPlanOptions(true);
                        }}
                      >
                        Change Plan
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask about EMI options..."
                  className="min-h-10 max-h-24 resize-none"
                />
                <Button size="icon" onClick={sendMessage} disabled={isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Pine Labs • Encrypted • PCI-DSS Level 1
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
