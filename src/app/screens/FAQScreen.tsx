import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function FAQScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'How accurate is the AI cost estimation?',
      answer: 'Our AI cost estimation provides 95% accuracy by analyzing real-time market data from 500+ suppliers, local labor rates, and historical project data. The system continuously learns from thousands of completed projects to improve accuracy.'
    },
    {
      question: 'Can I track multiple construction projects?',
      answer: 'Yes! Depending on your subscription plan, you can track 1-5 projects (Professional) or unlimited projects (Enterprise). Each project has its own dashboard, timeline, and budget tracking.'
    },
    {
      question: 'How can I customize the 3D House Visualization?',
      answer: 'Under the "3D View" screen, you can use the sidebar customization panel to adjust the architectural style (Modern, Classic, Eco Solar, Urban Brick), number of floors, roof design, and exterior color palette. The 3D model adapts in real-time to your preferences.'
    },
    {
      question: 'Is my project data secure?',
      answer: 'Absolutely! We use bank-grade encryption (AES-256) for all data at rest and in transit. Your project data is stored on secure cloud servers with daily backups and multi-factor authentication.'
    },
    {
      question: 'Can I collaborate with my contractor?',
      answer: 'Yes! BrickBrain includes real-time collaboration features. Share project updates, chat with contractors, track team attendance, and monitor progress together in one platform.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through industry-standard payment gateways.'
    },
    {
      question: 'What is the AI News & Insights feed?',
      answer: 'The AI News screen provides real-time updates and expert tips curated for your project. This includes construction methodology updates, market material price forecasts, site safety regulations, and smart budget-saving recommendations.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! All plans include a 14-day free trial with no credit card required. You get full access to all features during the trial period.'
    }
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <HelpCircle className="w-10 h-10 text-[#FF6B00]" />
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 text-lg">Find answers to common questions about BrickBrain</p>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                >
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF6B00] flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <h3 className="text-white font-semibold mb-2">Still have questions?</h3>
          <p className="text-white/70 text-sm mb-4">Our support team is here to help</p>
          <button
            onClick={() => navigate('/app/support')}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
