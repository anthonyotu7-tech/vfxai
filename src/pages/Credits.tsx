export default function Credits() {
  const plans = [
    { name: 'Starter', price: 19, credits: 500 },
    { name: 'Pro', price: 49, credits: 1500 },
    { name: 'Enterprise', price: 99, credits: 3500 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Upgrade Your Studio</h1>
      <p className="text-white/60">Choose a plan</p>
      
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-gray-900 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-3xl font-bold text-white mt-2">${plan.price}<span className="text-sm text-white/60">/mo</span></p>
            <p className="text-white/60 mt-2">{plan.credits} credits</p>
            <button className="mt-4 w-full bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-2 rounded-lg">
              Get {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
