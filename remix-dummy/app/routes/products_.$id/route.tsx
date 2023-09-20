import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import type { IProduct } from "~/interfaces/IProduct";

export const meta: MetaFunction = ({ params }) => ([
  { title: `Product with id : ${params.id}` },
  { name: "description", content: "Product Detail" },
])

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const response = await fetch(`https://dummyjson.com/products/${params.id}`);
    const product: IProduct = await response.json();
    return json({ product });
  } catch (error) {
    throw new Response("Not found", { status: 404 });
  }
};

export default function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const { product } = useLoaderData<typeof loader>();

  return (
    <>
      <div>
        <h1>Product with id : {params.id}</h1>
        <p>Product name : {product.title}</p>
        <button type="button" onClick={() => navigate(-1)}>Back to Products</button>
      </div>
    </>
  )
}
