import { useState } from 'react';
import { Shield, Eye, Lock, Database, Share2, UserCheck, ChevronRight } from 'lucide-react';
import Header from '../components/Header';

export default function PrivacyPolicy() {
    const [hoveredCard, setHoveredCard] = useState(null);

    const privacySections = [
        {
            id: 'commitment',
            title: 'Our Privacy Commitment',
            icon: Shield,
            color: 'purple',
            description: 'Abyride is committed to protecting your privacy and handling your personal information responsibly. We believe transparency is key to building trust.',
            features: ['Complete transparency', 'No data selling', 'User control', 'Legal compliance']
        },
        {
            id: 'collection',
            title: 'What We Collect',
            icon: Database,
            color: 'blue',
            description: 'We collect personal details such as your name, contact information, payment details, ride history, and location data necessary for our services.',
            features: ['Personal information', 'Payment details', 'Location data', 'Usage patterns']
        },
        {
            id: 'usage',
            title: 'How We Use Your Data',
            icon: Eye,
            color: 'green',
            description: 'Your information is used to provide and improve transportation services, process payments, ensure security, and comply with legal obligations.',
            features: ['Service delivery', 'Payment processing', 'Security measures', 'Legal compliance']
        },
        {
            id: 'security',
            title: 'Data Protection',
            icon: Lock,
            color: 'red',
            description: 'Industry-standard security measures protect your data from unauthorized access, loss, or disclosure with continuous monitoring.',
            features: ['Encryption', '24/7 monitoring', 'Secure storage', 'Access controls']
        },
        {
            id: 'sharing',
            title: 'Data Sharing Policy',
            icon: Share2,
            color: 'orange',
            description: 'We share information only when necessary for service provision or required by law. We never sell your personal data to third parties.',
            features: ['Limited sharing', 'Service partners only', 'Legal requirements', 'No data sales']
        },
        {
            id: 'rights',
            title: 'Your Data Rights',
            icon: UserCheck,
            color: 'indigo',
            description: 'You have comprehensive rights regarding your data, including access, modification, deletion, and portability options.',
            features: ['Data access', 'Modification rights', 'Deletion options', 'Data portability']
        }
    ];

    const dataTypes = [
        { icon: UserCheck, label: 'Personal Info', items: ['Name', 'Email', 'Phone', 'Profile Photo'] },
        { icon: Lock, label: 'Payment Data', items: ['Card Details', 'Billing Address', 'Transaction History'] },
        { icon: Database, label: 'Ride History', items: ['Trip Details', 'Routes', 'Preferences', 'Ratings'] },
        { icon: Share2, label: 'Location Data', items: ['GPS Coordinates', 'Pickup/Dropoff', 'Real-time Tracking'] }
    ];

    const primaryColor = '#293751';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header title="privacy policy" />
            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-6 py-16">

                {/* Privacy Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {privacySections.map((section, index) => {
                        const Icon = section.icon;
                        const isHovered = hoveredCard === section.id;

                        return (
                            <div
                                key={section.id}
                                onMouseEnter={() => setHoveredCard(section.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${isHovered ? 'transform -translate-y-2' : ''
                                    }`}
                            >
                                <div className="h-2" style={{ background: primaryColor }}></div>
                                <div className="p-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: primaryColor }}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>

                                    <div className="space-y-2">
                                        {section.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {isHovered && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none"></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Data Types Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Data We Collect</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Here's a detailed breakdown of the types of information we collect to provide you with the best service experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dataTypes.map((type, index) => {
                            const Icon = type.icon;
                            return (
                                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                                            <Icon className="w-5 h-5" style={{ color: primaryColor }} />
                                        </div>
                                        <h4 className="font-semibold text-gray-900">{type.label}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {type.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                                <span className="text-sm text-gray-600">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}