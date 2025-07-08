import React from 'react';
import { ShoppingBag, TrendingUp, Package, DollarSign } from 'lucide-react';

export const MarketplaceTeaser: React.FC = () => {
  const comingSoonFeatures = [
    {
      icon: Package,
      title: 'Buy & Sell Equipment',
      description: 'Trade powerlifting gear with verified lifters'
    },
    {
      icon: DollarSign,
      title: 'Fair Pricing',
      description: 'Market-based pricing with price history'
    },
    {
      icon: TrendingUp,
      title: 'Trending Items',
      description: 'See what equipment is popular'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center mb-4">
        <ShoppingBag className="w-6 h-6 text-orange-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Marketplace</h3>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-900/30 rounded-full mb-4 border border-orange-700/30">
          <ShoppingBag className="w-8 h-8 text-orange-400" />
        </div>
        <h4 className="font-semibold text-white mb-2">Coming Soon</h4>
        <p className="text-sm text-slate-400 mb-4">
          Buy and sell powerlifting equipment with fellow lifters in a trusted marketplace.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {comingSoonFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          
          return (
            <div key={index} className="flex items-start p-3 bg-slate-700 rounded-lg border border-slate-600">
              <IconComponent className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-white text-sm">{feature.title}</h5>
                <p className="text-xs text-slate-400">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <input 
          type="email"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-slate-400"
          placeholder="Enter email for updates"
        />
        <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors">
          Notify Me When Available
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Expected Launch</span>
          <span className="text-orange-400 font-medium">Q2 2025</span>
        </div>
      </div>
    </div>
  );
};