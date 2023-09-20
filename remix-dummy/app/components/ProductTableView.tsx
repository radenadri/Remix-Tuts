import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { IProduct } from '~/interfaces/IProduct';
import type { IProductLists } from '~/interfaces/IProductLists';
import { useEffect, useState } from 'react';
import DebouncedInput from './DebounceInput';

const columnHelper = createColumnHelper<IProduct>()

const columns = [
  columnHelper.accessor('id', {
    id: 'id',
    cell: info => info.getValue(),
    header: () => <span>ID</span>,
    footer: () => <span>ID</span>,
  }),
  columnHelper.accessor(row => row.title, {
    id: 'title',
    cell: info => (
      <Link to={`/products/${info.row.original.id}`}>{info.getValue()}</Link>
    ),
    header: () => <span>Title</span>,
    footer: () => <span>Title</span>,
  }),
  columnHelper.accessor('price', {
    id: 'price',
    cell: info => `$${info.getValue()}`,
    header: () => 'Price',
    footer: () => 'Price',
  }),
  columnHelper.accessor('description', {
    id: 'description',
    cell: info => info.getValue(),
    header: () => 'Description',
    footer: () => 'Description',
  }),
];

/**
 * Retrieves a list of products from the server.
 *
 * @param {number} limit - The maximum number of products to retrieve. Default is 5.
 * @param {number} skip - The number of products to skip. Default is 0.
 * @return {Promise<IProduct[]>} A promise that resolves to an array of products.
 */
async function getProducts(limit: number = 5, skip: number = 0, q: string = ''): Promise<IProduct[]> {
  const url = new URL(q.length === 0 ? 'https://dummyjson.com/products' : `https://dummyjson.com/products/search?q=${q}`);
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('skip', skip.toString());

  console.log(url);

  const response = await fetch(
    url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data: IProductLists = await response.json();

  return data.products.map((product: IProduct) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    description: product.description
  }));
}

/**
 * Renders a table view of products.
 *
 * @return {JSX.Element} The JSX element representing the product table view.
 */
export default function ProductTableView() {

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);

  const { status, data, refetch, isError, isLoading } = useQuery({
    queryKey: ['getProducts'],
    queryFn: () => getProducts(limit, skip, globalFilter),
  });

  const table = useReactTable({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'id', desc: false }],
    },
    state: {
      limit,
      skip,
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    debugAll: true
  });

  useEffect(() => {
    if (status === 'success' && data !== undefined) {
      setProducts(data);
    }
  }, [status, data]);

  useEffect(() => {
    refetch();
    setSkip(0);
  }, [limit, globalFilter, refetch]);

  return (
    <div>
      <h1>Product Lists</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong!</p>}
      {products.length > 0 && (
        <div>
          <div>
            <span style={{
              marginRight: '.5rem'
            }}>Search:</span>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              className="mx-1 p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
            />
          </div>
          <div>
            <span style={{
              marginRight: '.5rem'
            }}>Per page:</span>
            <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
              {[5, 10, 20].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <br />
          <table>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }>
                        {{
                          asc: '🔼',
                          desc: '🔽',
                        }[header.column.getIsSorted() as string] ?? '📶'}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      )}
      <br />
      <Link to="/">Go Back</Link>
      <br />
      <div style={{
        display: 'flex'
      }}>
        <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}