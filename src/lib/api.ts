export interface JellyBean {
  beanId: number;
  flavorName: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
  sugarFree: boolean;
  groupName: string[];
  colorGroup: string;
  backgroundColor: string;
  glutenFree: boolean;
  seasonal: boolean;
  kosher: boolean;
}

export interface JellyBeanResponse {
  items: JellyBean[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const API_BASE_URL = 'https://jellybellywikiapi.onrender.com/api';

export async function fetchJellyBeans(
  pageIndex: number = 1,
  pageSize: number = 200
): Promise<JellyBeanResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Beans?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        next: { 
          revalidate: 3600, // Cache for 1 hour
          tags: ['jelly-beans'] // Add cache tags for better invalidation
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch jelly beans: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching jelly beans:', error);
    throw error;
  }
}

export async function getJellyBeans(): Promise<JellyBean[]> {
  const response = await fetchJellyBeans();
  return response.items;
}

// Pagination parameters for infinite scroll
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  filterBy?: string;
}

// Client-side pagination and filtering for infinite scroll
export function paginateAndFilterJellyBeans(
  jellyBeans: JellyBean[],
  params: PaginationParams
): { items: JellyBean[]; hasMore: boolean; total: number } {
  let filtered = jellyBeans;

  // Apply filter if provided
  if (params.filterBy) {
    filtered = jellyBeans.filter(bean => 
      bean.groupName.some(group => group.includes(params.filterBy!))
    );
  }

  // Apply sorting if provided
  if (params.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      switch (params.sortBy) {
        case 'name':
          return a.flavorName.localeCompare(b.flavorName);
        case 'name-desc':
          return b.flavorName.localeCompare(a.flavorName);
        case 'flavorGroup':
          const aGroup = a.groupName[0] || '';
          const bGroup = b.groupName[0] || '';
          return aGroup.localeCompare(bGroup);
        case 'flavorGroup-desc':
          const aGroupDesc = a.groupName[0] || '';
          const bGroupDesc = b.groupName[0] || '';
          return bGroupDesc.localeCompare(aGroupDesc);
        case 'sugarFree':
          return Number(b.sugarFree) - Number(a.sugarFree);
        case 'sugarFree-desc':
          return Number(a.sugarFree) - Number(b.sugarFree);
        default:
          return 0;
      }
    });
  }

  // Calculate pagination
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const items = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < filtered.length;

  return {
    items,
    hasMore,
    total: filtered.length
  };
}
