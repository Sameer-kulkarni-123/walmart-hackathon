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
    id: string; // product_id passed as query param
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
    <div className="p-4 lg:p-10 flex flex-col lg:flex-row w-full">
      {/* Sidebar Thumbnails */}
      <div className="hidden lg:flex flex-col space-y-4">
        {general.images?.map((image, i) => (
          <Image
            key={image + i}
            src={image}
            alt={`${general.title} ${i}`}
            width={90}
            height={90}
            className="border rounded-sm"
          />
        ))}
      </div>

      {/* Carousel */}
      <Carousel
        opts={{ loop: true }}
        className="w-full max-w-xl mx-auto mb-10 lg:mb-0 lg:mx-20"
      >
        <CarouselContent>
          {general.images?.map((image, i) => (
            <CarouselItem key={i}>
              <div className="p-1">
                <div className="flex aspect-square items-center justify-center p-2 relative">
                  <Image
                    src={image}
                    alt={`${general.title} ${i}`}
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Product Details */}
      <div className="flex-1 border rounded-md w-full p-5 space-y-5">
        <h1 className="text-3xl font-bold">{general.title}</h1>

        <div className="space-x-2 flex flex-wrap">
          {breadcrumbs.map((breadcrumb: any, i: number) => (
            <Badge key={i}>{breadcrumb.category_name || breadcrumb}</Badge>
          ))}
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: general.description || "<p>No description available.</p>",
          }}
          className="py-5 text-gray-700"
        />

        {rating && (
          <p className="text-yellow-500 text-sm">
            {rating.rating} ★
            <span className="text-gray-400 ml-2">({rating.count} reviews)</span>
          </p>
        )}

        <p className="text-2xl font-bold mt-2">
          {priceInfo.currency} {priceInfo.price}
        </p>

        <AddToCart product={product} />

        <hr />

        <h3 className="font-bold text-xl pt-10">Specifications</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Specification</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specs.map((spec: any) => (
              <TableRow key={spec.key}>
                <TableCell className="font-bold">{spec.key}</TableCell>
                <TableCell>{spec.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ProductPage;
