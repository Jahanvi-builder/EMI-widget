export type BankCode = "HDFC" | "ICICI" | "AXIS" | "SBI" | "KOTAK";

export type EmiPlan = {
  tenure: number;
  monthly: number;
  interestRate: number;
  processingFee: number;
  label: string;
  popular?: boolean;
  offer?: string;
};

export const ORDER = {
  name: "Osaka Sectional Sofa",
  amount: 74999,
  currency: "INR",
};

export const EMI_PLANS: Record<BankCode, EmiPlan[]> = {
  HDFC: [
    { tenure: 3, monthly: 25333, interestRate: 0, processingFee: 0, label: "No cost EMI" },
    {
      tenure: 6,
      monthly: 12833,
      interestRate: 0,
      processingFee: 0,
      label: "No cost EMI",
      popular: true,
      offer: "Zero processing fee",
    },
    { tenure: 9, monthly: 8611, interestRate: 0, processingFee: 0, label: "No cost EMI" },
    { tenure: 12, monthly: 6594, interestRate: 12, processingFee: 499, label: "12% p.a." },
  ],
  ICICI: [
    { tenure: 3, monthly: 25333, interestRate: 0, processingFee: 0, label: "No cost EMI" },
    { tenure: 6, monthly: 12833, interestRate: 0, processingFee: 0, label: "No cost EMI", popular: true },
    { tenure: 12, monthly: 6594, interestRate: 12, processingFee: 499, label: "12% p.a." },
  ],
  AXIS: [
    { tenure: 6, monthly: 12833, interestRate: 0, processingFee: 0, label: "No cost EMI", popular: true },
    { tenure: 9, monthly: 8611, interestRate: 0, processingFee: 0, label: "No cost EMI" },
    { tenure: 12, monthly: 6703, interestRate: 13, processingFee: 299, label: "13% p.a." },
  ],
  SBI: [
    { tenure: 6, monthly: 13025, interestRate: 0.5, processingFee: 200, label: "0.5% p.a." },
    { tenure: 9, monthly: 8756, interestRate: 1, processingFee: 200, label: "1% p.a." },
    { tenure: 12, monthly: 6703, interestRate: 13, processingFee: 499, label: "13% p.a." },
  ],
  KOTAK: [
    { tenure: 3, monthly: 25333, interestRate: 0, processingFee: 0, label: "No cost EMI" },
    { tenure: 6, monthly: 12833, interestRate: 0, processingFee: 0, label: "No cost EMI", popular: true },
  ],
};

export const BANK_OPTIONS: Array<BankCode | "OTHER"> = ["HDFC", "ICICI", "AXIS", "SBI", "KOTAK", "OTHER"];

export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
