import React from "react";

export type GlobalCardNetwork =
  | "visa"
  | "mastercard"
  | "american-express"
  | "rupay"
  | "discover"
  | "diners-club"
  | "jcb"
  | "unionpay"
  | "maestro"
  | "elo"
  | "mir"
  | "hipercard"
  | "troy"
  | "verve"
  | "generic";

export interface GlobalCardStyleConfig {
  network: GlobalCardNetwork;
  displayName: string;
  gradient: string;
  glow: string;
  tier: string;
  logo: React.ReactNode;
  textColor: string;
  hologramColor: string;
}

export interface PaymentCardProps {
  brand?: string | null;
  last4?: string | null;
  cardNumber?: string | null;
  cardholderName?: string | null;
  expMonth?: string | number | null;
  expYear?: string | number | null;
  bankName?: string | null;
  currency?: string | null;
  funding?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  interactive?: boolean;
}
