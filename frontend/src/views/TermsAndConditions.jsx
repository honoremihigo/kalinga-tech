import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Shield, Users, CreditCard, AlertTriangle, Phone } from 'lucide-react';
import Header from '../components/Header';

export default function TermsAndConditions() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const termsData = [
    {
      id: 1,
      icon: FileText,
      title: "Introduction and Acceptance",
      content: "By downloading or using the Abyride app, you agree to these Terms and the Privacy Policy. If you do not agree, you must not use the service. Abyride may update these Terms at any time, and continued use means you accept the changes. Users are encouraged to review the Terms regularly to stay informed."
    },
    {
      id: 2,
      icon: Users,
      title: "Eligibility",
      content: "You must be at least 18 years old (or the legal age in your jurisdiction) and provide accurate, up-to-date information. Drivers must hold valid licenses, registration, and insurance. Abyride reserves the right to verify credentials and suspend or terminate accounts for ineligibility or violations."
    },
    {
      id: 3,
      icon: Shield,
      title: "Account Registration and Security",
      content: "Users must create an account with accurate personal and payment information. You are responsible for safeguarding your login credentials and must report unauthorized use immediately. Sharing accounts is prohibited, and Abyride may require identity verification for security and compliance."
    },
    {
      id: 4,
      icon: FileText,
      title: "Service Description",
      content: "Abyride connects riders with independent drivers. All rides are subject to availability, and both drivers and riders can cancel under certain conditions. Abyride acts as a facilitator and does not operate vehicles or employ drivers directly."
    },
    {
      id: 5,
      icon: CreditCard,
      title: "Payments and Fees",
      content: "Payments are processed securely through the app. Fares are based on distance, time, demand, and other factors. Additional fees (like tolls or parking) may apply. Failure to pay may result in account suspension. Refunds are handled according to Abyride's policy."
    },
    {
      id: 6,
      icon: Users,
      title: "User Conduct and Responsibilities",
      content: "Users must behave respectfully and comply with all laws. Harassment, discrimination, or abuse is prohibited. Misuse of the service or providing false information can result in suspension or legal action."
    },
    {
      id: 7,
      icon: Shield,
      title: "Privacy and Data",
      content: "Abyride collects and uses personal data as described in its Privacy Policy, including for service provision, communication, and legal compliance. Data is protected with industry-standard security measures and may be shared with third parties only as required. Users have rights to access and correct their data."
    },
    {
      id: 8,
      icon: AlertTriangle,
      title: "Termination and Suspension",
      content: "Abyride may suspend or terminate accounts for violations, fraud, or safety concerns, with or without notice. Users can also close their accounts at any time. Termination does not release users from prior obligations, and some data may be retained for legal reasons."
    },
    {
      id: 9,
      icon: AlertTriangle,
      title: "Disclaimers and Limitation of Liability",
      content: "The app is provided \"as is\" without warranties. Abyride is not liable for damages, losses, or interruptions in service, except as required by law. Users assume the risks of using the service."
    },
    {
      id: 10,
      icon: Shield,
      title: "Indemnification",
      content: "Users agree to indemnify Abyride against claims, damages, or losses arising from misuse, violations, or third-party rights infringements. This obligation survives account termination."
    },
    {
      id: 11,
      icon: FileText,
      title: "Governing Law and Dispute Resolution",
      content: "The Terms are governed by the laws of your jurisdiction. Disputes should first be resolved informally; if unresolved, they may go to binding arbitration or court. Users waive rights to jury trials or class actions. Arbitration is confidential, and Abyride may seek court relief to protect its rights."
    },
    {
      id: 12,
      icon: FileText,
      title: "Changes to Terms",
      content: "Abyride may modify the Terms at any time, with notice provided via the app or email. Continued use after changes means acceptance. Users who disagree must stop using the service. Changes do not affect prior rights or obligations."
    },
    {
      id: 13,
      icon: Phone,
      title: "Contact Information",
      content: "For questions or feedback about the Terms, users can contact Abyride's support team via email or at their office. Prompt assistance is provided, and user feedback is valued for ongoing improvement."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Header title="Terms and Conditions" />
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="space-y-4">
          {termsData.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden w-full ">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center w-full space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#293751]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.id}. {section.title}
                      </h3>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="pl-13">
                      <div className="h-px bg-gray-200 mb-4"></div>
                      <p className="text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}