import fetchProduct from "@/lib/fetchProduct";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddToCart from "@/components/AddToCart";

type Props = {
  searchParams: {
    id: string;
  };
};

async function ProductPage({ searchParams: { id } }: Props) {
  const product = await fetchProduct(id);
  if (!product) return notFound();

  const general = product.general;
  const priceInfo = product.price;
  const rating = product.rating;
  const specs = product.specifications || [];
  const breadcrumbs = product.breadcrumbs || [];

  return (
    <div className="p-2 sm:p-4 lg:p-10 flex flex-col lg:flex-row w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Sidebar Thumbnails */}
      <div className="hidden lg:flex flex-col space-y-4 mr-8">
        {general.images?.map((image, i) => (
          <Image
            key={image + i}
            src={image}
            alt={`${general.title} ${i}`}
            width={90}
            height={90}
            className="border rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

      {/* Carousel */}
      <div className="w-full lg:max-w-xl mx-auto mb-6 lg:mb-0 lg:mx-20">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {general.images?.map((image, i) => (
              <CarouselItem key={i}>
                <div className="p-1">
                  <div className="flex aspect-square items-center justify-center p-2 relative bg-white rounded-xl shadow-lg">
                    <Image
                      src={image}
                      alt={`${general.title} ${i}`}
                      width={400}
                      height={400}
                      className="object-contain rounded-xl w-full h-auto max-h-[300px] sm:max-h-[400px]"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Product Details */}
      <div className="flex-1 border rounded-2xl w-full p-4 sm:p-8 space-y-5 sm:space-y-7 bg-white/80 shadow-xl backdrop-blur-md mt-4 lg:mt-0">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
          {general.title}
        </h1>

        <div className="space-x-2 flex flex-wrap">
          {breadcrumbs.map((breadcrumb: any, i: number) => (
            <Badge
              key={i}
              className="bg-blue-400 text-white font-semibold px-3 py-1 rounded-full shadow mb-2"
            >
              {breadcrumb.category_name || breadcrumb}
            </Badge>
          ))}
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: general.description || "<p>No description available.</p>",
          }}
          className="py-3 sm:py-5 text-gray-700 text-base sm:text-lg"
        />

        {rating && (
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500 text-lg sm:text-xl font-bold">
              {rating.rating} ★
            </span>
            <span className="text-gray-500 text-xs sm:text-sm">
              ({rating.count} reviews)
            </span>
          </div>
        )}

        <p className="text-2xl sm:text-3xl font-extrabold mt-2 text-green-700 drop-shadow">
          {priceInfo.currency} {priceInfo.price}
        </p>

        <AddToCart product={product} />

        <hr className="my-4 sm:my-6 border-t-2 border-blue-200" />

        <h3 className="font-bold text-xl sm:text-2xl pt-4 sm:pt-6 text-blue-700">
          Specifications
        </h3>

        <div className="overflow-x-auto">
          <Table className="rounded-lg overflow-hidden shadow-md min-w-[300px]">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-100 to-purple-100">
                <TableHead className="font-bold text-gray-700">
                  Specification
                </TableHead>
                <TableHead className="font-bold text-gray-700">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((spec: any) => (
                <TableRow
                  key={spec.key}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-800">
                    {spec.key}
                  </TableCell>
                  <TableCell className="text-gray-600">{spec.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
