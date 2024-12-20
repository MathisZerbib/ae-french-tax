export const ACTIVITY_TYPES = {
  MERCHANDISE: 'Vente de marchandises',
  SERVICES_BIC: 'Prestations de services artisanales et commerciales (BIC)',
  SERVICES_BNC: 'Prestations de services libérales (BNC)',
  SERVICES_BNC_REGULATED: 'Prestations de services libérales réglementées',
  FURNISHED_RENTAL: 'Location de meublés de tourisme classés',
};

export const ALLOWANCE_RATES = {
  [ACTIVITY_TYPES.MERCHANDISE]: 0.71,
  [ACTIVITY_TYPES.SERVICES_BIC]: 0.50,
  [ACTIVITY_TYPES.SERVICES_BNC]: 0.34,
  [ACTIVITY_TYPES.SERVICES_BNC_REGULATED]: 0.34,
  [ACTIVITY_TYPES.FURNISHED_RENTAL]: 0.71,
};

export const SOCIAL_CONTRIBUTION_RATES = {
  [ACTIVITY_TYPES.MERCHANDISE]: 0.123,
  [ACTIVITY_TYPES.SERVICES_BIC]: 0.212,
  [ACTIVITY_TYPES.SERVICES_BNC]: 0.231,
  [ACTIVITY_TYPES.SERVICES_BNC_REGULATED]: 0.232,
  [ACTIVITY_TYPES.FURNISHED_RENTAL]: 0.06,
};

export const INCOME_TAX_BRACKETS = [
  { max: 11294, rate: 0 },
  { max: 28797, rate: 0.11 },
  { max: 82341, rate: 0.30 },
  { max: 177106, rate: 0.41 },
  { max: Infinity, rate: 0.45 },
];

export const calculateTaxableIncome = (revenue: number, activityType: string): number => {
  const allowanceRate = ALLOWANCE_RATES[activityType];
  return revenue * (1 - allowanceRate);
};

export const calculateIncomeTax = (taxableIncome: number, familyQuotient: number): number => {
  const taxableIncomePerPart = taxableIncome / familyQuotient;
  let totalTax = 0;
  let remainingIncome = taxableIncomePerPart;

  for (const bracket of INCOME_TAX_BRACKETS) {
    if (remainingIncome > 0) {
      const taxableAmount = Math.min(remainingIncome, bracket.max);
      totalTax += taxableAmount * bracket.rate;
      remainingIncome -= taxableAmount;
    } else {
      break;
    }
  }

  return totalTax * familyQuotient;
};

export const calculateSocialContributions = (revenue: number, activityType: string): number => {
  const rate = SOCIAL_CONTRIBUTION_RATES[activityType];
  return revenue * rate;
};

export const calculateOtherCharges = (revenue: number, activityType: string): number => {
  // CFP (Contribution à la Formation Professionnelle)
  const cfpRate = activityType === ACTIVITY_TYPES.MERCHANDISE ? 0.001 : 0.002;
  const cfp = revenue * cfpRate;

  // TFCC (Taxe pour Frais de Chambre Consulaire)
  const tfcc = revenue * 0.00015;

  // CFE (Cotisation Foncière des Entreprises) - estimation simplifiée
  const cfe = Math.min(revenue * 0.005, 1000);

  return cfp + tfcc + cfe;
};

export const calculateMonthly = (monthlyRevenue: number): number => {
  return monthlyRevenue * 12;
};

export const calculateTotalTaxesAndCharges = (
  monthlyRevenue: number,
  activityType: string,
  familyQuotient: number
): {
  annualRevenue: number;
  monthlyRevenue: number;
  taxableIncome: number;
  incomeTax: number;
  socialContributions: number;
  otherCharges: number;
  totalAnnual: number;
  totalMonthly: number;
  totalAfterTaxAnnual: number;
  totalAfterTaxMonthly: number;
} => {
  const annualRevenue = calculateMonthly(monthlyRevenue);

  const taxableIncome = calculateTaxableIncome(annualRevenue, activityType);
  const incomeTax = calculateIncomeTax(taxableIncome, familyQuotient);
  const socialContributions = calculateSocialContributions(annualRevenue, activityType);
  const otherCharges = calculateOtherCharges(annualRevenue, activityType);
  const totalAnnual = incomeTax + socialContributions + otherCharges;
  const totalMonthly = totalAnnual / 12;
  const totalAfterTaxAnnual = annualRevenue - totalAnnual;
  const totalAfterTaxMonthly = totalAfterTaxAnnual / 12;

  return {
    annualRevenue,
    monthlyRevenue,
    taxableIncome,
    incomeTax,
    socialContributions,
    otherCharges,
    totalAnnual,
    totalMonthly,
    totalAfterTaxAnnual,
    totalAfterTaxMonthly,
  };
};

export const calculateFamilyQuotient = (
  parents: number,
  children: number,
  disabledChildren: number
): number => {
  let parts = parents;

  if (children <= 2) {
    parts += children * 0.5;
  } else if (children === 3) {
    parts += 1 + (children - 2);
  } else {
    parts += 2 + (children - 3) * 0.5;
  }

  parts += disabledChildren * 0.5;

  return parts;
};