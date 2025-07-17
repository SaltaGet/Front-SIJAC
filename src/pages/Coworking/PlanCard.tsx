import React from 'react';

interface PlanCardProps {
  title: string;
  subtitle: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
  hoverColor: string;
  link: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  subtitle,
  price,
  period,
  features,
  buttonText,
  buttonColor,
  hoverColor,
  link
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-prim-100 transform hover:scale-105 transition duration-300 flex flex-col h-full">
      <div className={`bg-${buttonColor} text-white py-4 px-6`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="opacity-90">{subtitle}</p>
      </div>
      
      <div className="p-6 flex-grow">
        <div className="text-3xl font-bold text-gray-800 mb-4">
          {price} <span className="text-lg font-normal text-gray-600">/{period}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-prim-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 pt-0">
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full bg-${buttonColor} hover:bg-${hoverColor} text-white font-medium py-2 px-4 rounded transition duration-200 text-center`}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default PlanCard;