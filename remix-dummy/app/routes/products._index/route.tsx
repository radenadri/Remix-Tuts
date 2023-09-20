import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import ProductListView from "~/components/ProductListView";
import ProductTableView from "~/components/ProductTableView";
import type { IProductLists } from "~/interfaces/IProductLists";

/**
 * Generates a meta function that returns an array of meta objects.
 *
 * @returns {Array} An array of meta objects containing title and name properties.
 */
export const meta: MetaFunction = () => ([
  { title: "Product Lists" },
  { name: "description", content: "Product Lists" },
])

/**
 * Fetches data from a remote API and returns a JSON response.
 *
 * @param {LoaderFunctionArgs} request - An object containing the request data.
 * @return {Promise<Response>} - A promise that resolves to the JSON response.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const view: string = url.searchParams.get('view') ?? 'lists';
  const limit: number | string = url.searchParams.get('limit') ?? 5;
  const skip: number | string = url.searchParams.get('skip') ?? 0;
  const page: number | string = url.searchParams.get('page') ?? 1;
  const q = url.searchParams.get('q') ?? '';

  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=id,title,description,price`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data: IProductLists = await response.json();

  return json({ data, limit, page, q, view });
};

/**
 * Renders the Products component.
 *
 * @return {JSX.Element} The rendered component.
 */
export default function Products() {
  const { data, limit, page, view } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handlePageChange = (method: string) => {
    const currentLimit: number = Number(limit);
    let currentPage: number = Number(page);

    if (method === 'next') {
      ++currentPage;
    }

    if (method === 'previous') {
      --currentPage;
    }

    submit({
      view,
      limit,
      skip: (currentPage * currentLimit) - currentLimit,
      page: currentPage
    }, { replace: true });
  }

  return (
    <>
      {view === 'lists' && <ProductListView data={data} page={page} handlePageChange={handlePageChange} />}
      {view === 'tables' && <ProductTableView />}
    </>
  )
}
