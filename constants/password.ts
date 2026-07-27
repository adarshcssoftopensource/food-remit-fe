export const PASSWORD_CRITERIA = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "Contains uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "Contains lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "Contains a number",
    test: (password: string) => /[0-9]/.test(password),
  },
] as const;
