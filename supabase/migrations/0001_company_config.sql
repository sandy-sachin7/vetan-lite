ALTER TABLE public.companies ADD COLUMN payroll_config JSONB DEFAULT '{
  "basicPercentage": 50,
  "hraPercentage": 50,
  "enablePf": true,
  "enablePt": true,
  "workingDays": 30,
  "companyLogo": "",
  "companyAddress": ""
}'::jsonb;
