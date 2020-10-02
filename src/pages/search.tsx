import { GetServerSideProps } from 'next';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { Document} from 'prismic-javascript/types/documents'
import { client } from '@/lib/prismic';
import Link from 'next/link';
import PrismicDom from 'prismic-dom';
import Prismic from 'prismic-javascript';

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults}: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  function handleSearch(e : FormEvent) {
    e.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSearch('');
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}/>
        <button type="submit">Buscar</button>  
      </form>

      <ul>
            {searchResults.map(searchResult => {
              return (
                <li key={searchResult.id}>
                  <Link href={`/catalog/products/${searchResult.uid}`}>
                    <a >
                      {PrismicDom.RichText.asText(searchResult.data.title)}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q } = context.query;

  if( !q ){
    return {
      props: {
        searchResults: []
      }
    }
  }

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q))
  ])

  return {
    props: {
      searchResults: searchResults.results,
    }
  }
}
