import { JellyBean } from '../lib/api';
import Image from 'next/image';

interface JellyBeanCardProps {
  jellyBean: JellyBean;
}

export default function JellyBeanCard({ jellyBean }: JellyBeanCardProps) {
  return (
    <article 
      className="bg-white rounded-lg shadow-md hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden min-h-[470px] flex flex-col transform hover:scale-[1.02] cursor-pointer group"
      aria-labelledby={`jelly-bean-title-${jellyBean.beanId}`}
      data-testid={`jelly-bean-${jellyBean.beanId}`}
      role="article"
    >
      <div 
        className="relative h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 overflow-hidden"
        role="img"
        aria-label={`Image of ${jellyBean.flavorName} jelly bean`}
      >
        <div className="absolute inset-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out">
          <div className="relative w-36 h-36 bg-white rounded-full shadow-inner flex items-center justify-center p-3 group-hover:shadow-lg transition-shadow duration-300">
            <Image
              src={jellyBean.imageUrl}
              alt={`${jellyBean.flavorName} jelly bean - ${jellyBean.description}`}
              width={120}
              height={120}
              className="object-contain max-w-full max-h-full drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
              sizes="120px"
              style={{
                objectPosition: 'center center',
                filter: 'saturate(1.1) contrast(1.05)',
              }}
            />
          </div>
        </div>
        {jellyBean.sugarFree && (
          <div 
            className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold group-hover:bg-green-600 group-hover:scale-105 transition-all duration-200"
            role="img"
            aria-label="Sugar-free product"
          >
            Sugar-Free
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 
          id={`jelly-bean-title-${jellyBean.beanId}`}
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200"
          data-testid="flavor-name"
        >
          {jellyBean.flavorName}
        </h3>
        
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium" aria-label="Flavor categories">Flavor Groups:</span> 
          <span aria-label={`Categories: ${jellyBean.groupName.join(', ')}`}>
            {jellyBean.groupName.join(', ')}
          </span>
        </div>
        
        <p 
          className="text-sm text-gray-700 mb-3 flex-grow"
          aria-label={`Product description: ${jellyBean.description}`}
        >
          {jellyBean.description}
        </p>
        
        {jellyBean.ingredients && jellyBean.ingredients.length > 0 && (
          <div className="text-xs text-gray-500 mt-auto">
            <span className="font-medium" aria-label="Product ingredients">Ingredients:</span>
            <p 
              className="mt-1 line-clamp-2"
              aria-label={`Ingredients list: ${jellyBean.ingredients.join(', ')}`}
            >
              {jellyBean.ingredients.join(', ')}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
