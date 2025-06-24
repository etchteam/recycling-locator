import { useSignal } from '@preact/signals';
import { Link } from 'react-router';

import '@/components/content/Icon/Icon';
import '@/components/composition/BorderedList/BorderedList';

import mapSearchParams from '@/lib/mapSearchParams';
import { CustomElement } from '@/types/customElement';
import { MaterialCategory } from '@/types/locatorApi';

interface MaterialCategoriesNavProps {
  readonly materialCategories: MaterialCategory[];
  /** The base of the href for material links */
  readonly basePath: string;
}

export default function MaterialCategoriesNav({
  materialCategories,
  basePath,
}: MaterialCategoriesNavProps) {
  const activeCategoryId = useSignal<string | null>(null);
  const hasActive = activeCategoryId.value !== null;

  function handleCategoryClick(categoryId: string | null) {
    activeCategoryId.value = categoryId;
  }

  return (
    <locator-material-categories-nav>
      <nav>
        <ul
          className={`material-categories-nav__categories ${hasActive ? 'material-categories-nav__categories--has-active' : ''}`}
        >
          {materialCategories.map((category) => {
            const isActive = activeCategoryId.value === category.id;
            const materialListId = `category-${category.id}-materials`;

            return (
              <li key={category.id} data-active={isActive}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  aria-expanded={isActive}
                  aria-controls={materialListId}
                >
                  {category.name}
                  <locator-icon
                    icon="arrow-right"
                    color="primary"
                  ></locator-icon>
                </button>
                <ul
                  className="material-categories-nav__materials"
                  id={materialListId}
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(null)}
                      aria-expanded={isActive}
                      aria-controls={materialListId}
                    >
                      <locator-icon
                        icon="arrow-left"
                        color="primary"
                      ></locator-icon>
                      {category.name}
                    </button>
                  </li>
                  {category.materials.map((material) => {
                    const searchParams = mapSearchParams(
                      ['materials', 'search'],
                      { materials: material.id, search: material.name },
                    );

                    return (
                      <li key={material.id}>
                        <Link to={`${basePath}?${searchParams.toString()}`}>
                          {material.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </locator-material-categories-nav>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-material-categories-nav': CustomElement;
    }
  }
}
