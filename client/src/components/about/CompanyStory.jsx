import React from 'react';

const CompanyStory = React.memo(() => {
  return (
    <section className="w-full px-2 py-8 flex items-center justify-center min-h-[40vh]">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
          HOW WE STAND UP
        </h1>

        <div className="space-y-2 text-sm md:text-base">
          <p className="text-gray-600 leading-snug text-justify">
          Our business journey began in the 1960s with the establishment of Sagarmal Rajkishor, a respected retail store founded by our grandfather, Sagar Seth, and later run by our father, Rajkishor Gupta. This small-town retail venture earned the trust of the local community with honesty and service excellence.
          </p>
          <p className="text-gray-600 leading-snug text-justify">
            
          In 2020, we took a step forward by launching Vinayak Traders, a wholesale distribution company serving the entire Sultanpur district. With strong roots and growing ambition, Rajat Gupta founded Shyam International to take our quality Indian products to the global market.
          </p>
        </div>
      </div>
    </section>
  );
});

CompanyStory.displayName = 'CompanyStory';

export default CompanyStory;
