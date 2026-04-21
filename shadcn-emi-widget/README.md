# Shadcn EMI Widget Prototype

This is a focused widget/chatbot prototype for the **Pay At Your Pace** EMI flow using shadcn UI component patterns.

## Included

- `src/components/emi-chat-widget.tsx`
  - Trigger card
  - Dialog-based widget
  - Bank selection chips
  - EMI plan cards
  - Plan confirmation card
  - Simulated payment success state
  - Chat input with basic assistant replies
- `src/lib/emi-data.ts`
  - Product and EMI plan data
  - INR formatting helpers
- `src/app/page.tsx`
  - Demo page showing only product summary + widget

## Assumptions

- You already have a Next.js App Router project with Tailwind and shadcn setup.
- Required shadcn components exist:
  - `button`
  - `badge`
  - `card`
  - `dialog`
  - `scroll-area`
  - `separator`
  - `textarea`

## Usage

1. Copy `src/components/emi-chat-widget.tsx` into your app.
2. Copy `src/lib/emi-data.ts` into your app.
3. Render `<EmiChatWidget />` wherever you need the trigger.
4. Replace static plan data with your API response when backend is ready.

## Production notes

- Move EMI plans to backend API.
- Keep payment action as redirect to real Pine Labs checkout.
- Track analytics events for open, bank_select, plan_select, pay_click, pay_success.
