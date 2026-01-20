export const USER_EXCLUDE_FIELDS = {
  password: true,
  recovery_token: true,
  token_expiration: true,
} as const;

export const USER_SELECT = {
  id: true,
  email: true,
  level: true,
  grade: true,
  account_type: true,
  created_at: true,
  updated_at: true,
} as const;

export const USER_SELECT_FOR_LOGIN = {
  id: true,
  email: true,
  password: true,
  level: true,
  grade: true,
  account_type: true,
} as const;
