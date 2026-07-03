import { useListTestimonials } from "@workspace/api-client-react";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Testimonials() {
  const { data: testimonials } = useListTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-accent/30 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary font-serif">
            Trusted by Founders Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our enrolled learners have to say about their journey to success.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto relative"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-border h-full flex flex-col relative">
                  <Quote className="absolute top-6 right-6 text-primary/20 w-12 h-12" />
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-secondary/80 flex-grow mb-8 font-medium italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg font-serif">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-secondary">{testimonial.name}</div>
                      <div className="text-sm text-primary font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-12 gap-4">
            <CarouselPrevious className="position-static transform-none h-12 w-12 border-primary text-primary hover:bg-primary hover:text-white" />
            <CarouselNext className="position-static transform-none h-12 w-12 border-primary text-primary hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
