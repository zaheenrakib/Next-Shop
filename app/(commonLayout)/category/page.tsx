// import ProductCard from "@/components/product/ProductCard";
// import { getProductsByCategorySlug } from "@/services/productService";


// const CategoryPage = async ({ params }: { params: { category: string } }) => {
//   // params.category থেকে আমরা "mobile" বা "laptop" পাচ্ছি
//   const data = await getProductsByCategorySlug(params.category);

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-8 capitalize">
//         {data.categoryName} Shop
//       </h1>
      
//       {data.products.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {data.products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">No products found in this category.</p>
//       )}
//     </div>
//   );
// };

// export default CategoryPage;