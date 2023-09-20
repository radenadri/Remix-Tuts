import { Link } from "@remix-run/react"
import type { IProduct } from "~/interfaces/IProduct"
import type { IProductLists } from "~/interfaces/IProductLists"

type ProductListViewType = {
  data: IProductLists
  page: string | number
  handlePageChange: (method: string) => void
}

/**
 * Renders the product list view.
 *
 * @param {ProductListViewType} data - The data containing the list of products.
 * @param {number} page - The current page number.
 * @param {function} handlePageChange - The function to handle page changes.
 * @return {JSX.Element} The rendered product list view.
 */
export default function ProductListView({ data, page, handlePageChange }: ProductListViewType) {
  return (
    <>
      <h1>Product Lists</h1>
      {data.products.length > 0 ? data.products.map((product: IProduct) => (
        <div key={product.id}>
          <Link to={`/products/${product.id}`}>
            <h2>{product.title}</h2>
          </Link>
          <p>{product.description}</p>
          <p>${product.price}</p>
        </div>
      )) : <h2>No data found</h2>}
      {Number(page) > 1 && <button type="button" onClick={() => handlePageChange('previous')}>Previous Page</button>}
      {(Number(page) >= 1 && data.products.length > 0) && <button type="button" onClick={() => handlePageChange('next')}>Next Page</button>}

      <Link to="/">Go Back</Link>
    </>
  );
}