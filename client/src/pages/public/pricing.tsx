import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Check,
  Star,
  Crown,
  Smartphone,
  Building,
  Users,
  Calendar,
  Shield,
  Zap,
  Infinity,
  ArrowRight,
  Download
} from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with property evaluation",
    features: [
      "Evaluate up to 3 properties",
      "5 visits per month",
      "9 rating categories",
      "8-item checklist",
      "Basic property comparison",
      "Web access only",
      "Email support"
    ],
    limitations: [
      "Limited to 3 properties",
      "5 visits per month max",
      "No mobile apps",
      "Basic reports only"
    ],
    buttonText: "Start Free",
    popular: false,
    icon: Building,
    color: "gray"
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious property evaluators and professionals",
    features: [
      "Unlimited properties",
      "Unlimited visits",
      "9 rating categories",
      "8-item checklist",
      "Advanced property comparison",
      "iOS & Android apps",
      "Export to PDF/Excel",
      "Priority email support",
      "Custom rating scales",
      "Visit history analytics"
    ],
    limitations: [],
    buttonText: "Start Pro Trial",
    popular: true,
    icon: Crown,
    color: "blue"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations managing large property portfolios",
    features: [
      "Everything in Pro",
      "Multi-user collaboration",
      "Team management",
      "Custom branding",
      "API access",
      "Advanced analytics",
      "Dedicated support",
      "Custom integrations",
      "White-label solution",
      "SLA guarantee"
    ],
    limitations: [],
    buttonText: "Contact Sales",
    popular: false,
    icon: Users,
    color: "purple"
  }
];

const comparisonFeatures = [
  {
    category: "Core Features",
    features: [
      { name: "Property Evaluations", free: "Up to 3", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Monthly Visits", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Rating Categories", free: "9", pro: "9 + Custom", enterprise: "9 + Custom" },
      { name: "Checklist Items", free: "8", pro: "8 + Custom", enterprise: "8 + Custom" },
      { name: "Property Comparison", free: "Basic", pro: "Advanced", enterprise: "Advanced" }
    ]
  },
  {
    category: "Access & Apps",
    features: [
      { name: "Web Dashboard", free: true, pro: true, enterprise: true },
      { name: "iOS App", free: false, pro: true, enterprise: true },
      { name: "Android App", free: false, pro: true, enterprise: true },
      { name: "Offline Mode", free: false, pro: true, enterprise: true }
    ]
  },
  {
    category: "Analytics & Export",
    features: [
      { name: "Basic Reports", free: true, pro: true, enterprise: true },
      { name: "Advanced Analytics", free: false, pro: true, enterprise: true },
      { name: "PDF Export", free: false, pro: true, enterprise: true },
      { name: "Excel Export", free: false, pro: true, enterprise: true },
      { name: "API Access", free: false, pro: false, enterprise: true }
    ]
  },
  {
    category: "Support & Collaboration",
    features: [
      { name: "Email Support", free: "Standard", pro: "Priority", enterprise: "Dedicated" },
      { name: "Multi-user Access", free: false, pro: false, enterprise: true },
      { name: "Team Management", free: false, pro: false, enterprise: true },
      { name: "Custom Branding", free: false, pro: false, enterprise: true }
    ]
  }
];

export default function Pricing() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free plan and upgrade as your property evaluation needs grow. 
            All plans include our comprehensive 9-category rating system.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={tier.name} 
                className={`relative ${
                  tier.popular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    tier.color === 'blue' ? 'bg-blue-100' :
                    tier.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      tier.color === 'blue' ? 'text-blue-600' :
                      tier.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600 ml-1">/{tier.period}</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {tier.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Limitations:</h4>
                      <ul className="space-y-1">
                        {tier.limitations.map((limitation, index) => (
                          <li key={index} className="text-sm text-gray-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : tier.name === 'Enterprise'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {tier.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Feature Comparison
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {comparisonFeatures.map((category, categoryIndex) => (
              <div key={category.category} className={categoryIndex > 0 ? 'border-t' : ''}>
                <div className="bg-gray-50 px-6 py-3">
                  <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                </div>
                
                {category.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.name}
                    className={`px-6 py-4 grid grid-cols-4 gap-4 items-center ${
                      featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{feature.name}</div>
                    
                    <div className="text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600">{feature.free}</span>
                      )}
                    </div>
                    
                    <div className="text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600">{feature.pro}</span>
                      )}
                    </div>
                    
                    <div className="text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )
                      ) : (
                        <span className="text-gray-600">{feature.enterprise}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Apps Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <Smartphone className="w-16 h-16 mx-auto mb-6 text-blue-100" />
            <h2 className="text-3xl font-bold mb-4">Mobile Apps Coming Soon</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take PropertyVisit with you anywhere. Our iOS and Android apps will be available 
              for Pro and Enterprise customers, featuring offline evaluation and real-time sync.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Download className="mr-2" size={20} />
                Notify Me - iOS
              </Button>
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Download className="mr-2" size={20} />
                Notify Me - Android
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade to Pro at any time. Your data is always preserved when changing plans.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your data is preserved for 30 days after cancellation. You can reactivate anytime during this period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are the mobile apps really free for Pro users?
              </h3>
              <p className="text-gray-600">
                Yes! iOS and Android apps are included with Pro and Enterprise plans at no additional cost.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer discounts for annual billing?
              </h3>
              <p className="text-gray-600">
                Yes! Save 20% with annual billing on Pro and Enterprise plans. Contact us for details.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-lg text-gray-600 mb-6">
              Have more questions?
            </p>
            <Link href="/">
              <Button size="lg" variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}