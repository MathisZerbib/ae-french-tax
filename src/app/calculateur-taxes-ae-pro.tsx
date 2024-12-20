"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  ACTIVITY_TYPES,
  calculateTotalTaxesAndCharges,
  calculateFamilyQuotient,
} from "@/utils/taxCalculations";

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export default function CalculateurTaxesAEPro() {
  const [revenue, setRevenue] = useState<{
    value: number;
    type: "monthly" | "annual";
  }>({ value: 0, type: "monthly" });
  const [activityType, setActivityType] = useState<string>(
    ACTIVITY_TYPES.MERCHANDISE
  );
  const [parents, setParents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [disabledChildren, setDisabledChildren] = useState<number>(0);
  const [results, setResults] = useState<ReturnType<
    typeof calculateTotalTaxesAndCharges
  > | null>(null);

  const familyQuotient = calculateFamilyQuotient(
    parents,
    children,
    disabledChildren
  );

  const handleCalculate = useCallback(() => {
    const calculatedResults = calculateTotalTaxesAndCharges(
      revenue.value,
      activityType,
      familyQuotient,
      revenue.type === "monthly"
    );
    setResults(calculatedResults);
  }, [revenue, activityType, familyQuotient]);

  useEffect(() => {
    if (revenue.value > 0) {
      handleCalculate();
    }
  }, [
    revenue,
    activityType,
    parents,
    children,
    disabledChildren,
    handleCalculate,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-blue-600">
            Calculateur de Taxes Auto-Entrepreneur Pro
          </h1>
          <p className="text-gray-600 mt-2">
            Estimez vos impôts et charges en quelques clics
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  Calculez vos taxes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div variants={inputVariants}>
                  <Tabs
                    defaultValue="monthly"
                    onValueChange={(value) =>
                      setRevenue((prev) => ({
                        ...prev,
                        type: value as "monthly" | "annual",
                      }))
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="monthly">CA Mensuel</TabsTrigger>
                      <TabsTrigger value="annual">CA Annuel</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monthly">
                      <Label htmlFor="revenue">
                        Chiffre d&apos;affaires mensuel (€)
                      </Label>
                      <Input
                        id="revenue"
                        type="number"
                        placeholder="Entrez votre CA mensuel"
                        value={revenue.value || ""}
                        onChange={(e) =>
                          setRevenue({
                            value: Number(e.target.value),
                            type: "monthly",
                          })
                        }
                        className="mt-1"
                      />
                    </TabsContent>
                    <TabsContent value="annual">
                      <Label htmlFor="revenue">
                        Chiffre d&apos;affaires annuel (€)
                      </Label>
                      <Input
                        id="revenue"
                        type="number"
                        placeholder="Entrez votre CA annuel"
                        value={revenue.value || ""}
                        onChange={(e) =>
                          setRevenue({
                            value: Number(e.target.value),
                            type: "annual",
                          })
                        }
                        className="mt-1"
                      />
                    </TabsContent>
                  </Tabs>
                </motion.div>

                <motion.div variants={inputVariants} className="mt-4">
                  <Label htmlFor="activityType">Type d&apos;activité</Label>
                  <Select
                    onValueChange={setActivityType}
                    defaultValue={activityType}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionnez votre type d'activité" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={inputVariants} className="mt-4">
                  <Label>Situation familiale</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label htmlFor="parents">Parents</Label>
                      <Select
                        onValueChange={(value) => setParents(Number(value))}
                        defaultValue={parents.toString()}
                      >
                        <SelectTrigger id="parents">
                          <SelectValue placeholder="Nombre de parents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="children">Enfants</Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="disabledChildren">
                        Enfants handicapés
                      </Label>
                      <Input
                        id="disabledChildren"
                        type="number"
                        min="0"
                        value={disabledChildren}
                        onChange={(e) =>
                          setDisabledChildren(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <InfoCircledIcon className="mr-2 h-4 w-4" />
                          Comprendre le nombre de parts
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <h4 className="font-semibold mb-2">
                          Calcul du nombre de parts :
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>1 ou 2 parents : 1 part par parent</li>
                          <li>1 ou 2 enfants : 0,5 part par enfant</li>
                          <li>
                            3 enfants : 1 part pour les 2 premiers + 1 part pour
                            le 3ème
                          </li>
                          <li>
                            4 enfants et plus : 1 part pour les 2 premiers + 1
                            part pour le 3ème + 0,5 part par enfant
                            supplémentaire
                          </li>
                          <li>Enfant handicapé : 0,5 part supplémentaire</li>
                        </ul>
                        <p className="mt-2">
                          Votre nombre de parts : {familyQuotient}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} className="mt-6">
                  <Button
                    onClick={handleCalculate}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Calculer
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {results && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-600">
                      Résultats du calcul
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={resultVariants}>
                      <p className="font-medium">
                        Chiffre d&apos;affaires{" "}
                        {revenue.type === "monthly" ? "mensuel" : "annuel"} :{" "}
                        {revenue.type === "monthly"
                          ? results.monthlyRevenue.toFixed(2)
                          : results.annualRevenue.toFixed(2)}{" "}
                        €
                      </p>
                    </motion.div>
                    <motion.div variants={resultVariants} className="mt-2">
                      <p className="font-medium">
                        Revenu imposable{" "}
                        {revenue.type === "monthly" ? "mensuel" : "annuel"} :{" "}
                        {(revenue.type === "monthly"
                          ? results.taxableIncome / 12
                          : results.taxableIncome
                        ).toFixed(2)}{" "}
                        €
                      </p>
                    </motion.div>
                    <motion.div variants={resultVariants} className="mt-2">
                      <p className="font-medium">
                        Impôt sur le revenu{" "}
                        {revenue.type === "monthly" ? "mensuel" : "annuel"} :{" "}
                        {(revenue.type === "monthly"
                          ? results.incomeTax / 12
                          : results.incomeTax
                        ).toFixed(2)}{" "}
                        €
                      </p>
                    </motion.div>
                    <motion.div variants={resultVariants} className="mt-2">
                      <p className="font-medium">
                        Cotisations sociales{" "}
                        {revenue.type === "monthly"
                          ? "mensuelles"
                          : "annuelles"}{" "}
                        :{" "}
                        {(revenue.type === "monthly"
                          ? results.socialContributions / 12
                          : results.socialContributions
                        ).toFixed(2)}{" "}
                        €
                      </p>
                    </motion.div>
                    <motion.div variants={resultVariants} className="mt-2">
                      <p className="font-medium">
                        Autres charges{" "}
                        {revenue.type === "monthly"
                          ? "mensuelles"
                          : "annuelles"}{" "}
                        :{" "}
                        {(revenue.type === "monthly"
                          ? results.otherCharges / 12
                          : results.otherCharges
                        ).toFixed(2)}{" "}
                        €
                      </p>
                    </motion.div>
                    <motion.div
                      variants={resultVariants}
                      className="text-lg font-bold mt-4 pt-4 border-t border-gray-300"
                    >
                      Total {revenue.type === "monthly" ? "mensuel" : "annuel"}{" "}
                      des impôts et charges :{" "}
                      {(revenue.type === "monthly"
                        ? results.totalMonthly
                        : results.totalAnnual
                      ).toFixed(2)}{" "}
                      €
                    </motion.div>
                    <motion.div
                      variants={resultVariants}
                      className="text-lg font-bold mt-4 pt-4 border-t border-gray-300"
                    >
                      Revenu net{" "}
                      {revenue.type === "monthly" ? "mensuel" : "annuel"} après
                      impôts et charges :{" "}
                      {(revenue.type === "monthly"
                        ? results.totalAfterTaxMonthly
                        : results.totalAfterTaxAnnual
                      ).toFixed(2)}{" "}
                      €
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">
            Pourquoi utiliser notre calculateur ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Calculs précis</h3>
                <p>
                  Notre calculateur utilise les taux les plus récents pour vous
                  fournir une estimation précise de vos impôts et charges.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">
                  Visualisation claire
                </h3>
                <p>
                  Obtenez une vue d&apos;ensemble claire de votre situation
                  fiscale avec nos résultats détaillés et faciles à comprendre.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">
                  Mise à jour régulière
                </h3>
                <p>
                  Nous mettons régulièrement à jour notre calculateur pour
                  refléter les changements dans la législation fiscale.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 Calculateur de Taxes Auto-Entrepreneur Pro. Tous droits
            réservés. Mathis Zerbib.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <InfoCircledIcon className="inline mr-1" />
            Les calculs sont basés sur les taux en vigueur pour l&apos;année
            2024. Consultez un expert-comptable pour des conseils personnalisés.
          </p>
        </div>
      </footer>
    </div>
  );
}
