import { Property } from '@prisma/client';
import { InvestmentAnalysis } from '@/lib/analyzers/investment-analyzer';

export interface PropertyData extends Property {
    analysis: InvestmentAnalysis;
}
