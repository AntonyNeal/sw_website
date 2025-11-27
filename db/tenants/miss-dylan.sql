-- Sample tenant for Miss Dylan (placeholder)
-- Use this for staging only. Replace values with partner provided credentials

INSERT INTO tenants (id, subdomain, name, email, theme_config, content_config, status)
VALUES (
  gen_random_uuid(),
  'miss-dylan',
  'Miss Dylan',
  'hello@partner-domain.com',
  '{"theme":"miss-dylan"}',
  '{"welcome":"Welcome to the Miss Dylan booking page"}',
  'staging'
);
