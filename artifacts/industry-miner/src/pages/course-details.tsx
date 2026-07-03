import { useRoute } from "wouter";
import { useGetCourse } from "@workspace/api-client-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, PlayCircle, CheckCircle2, ChevronRight } from "lucide-react";

export default function CourseDetails() {
  const [, params] = useRoute("/course/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: course, isLoading } = useGetCourse(id, {
    query: {
      enabled: !!id,
      queryKey: ["course", id]
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;
  }

  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(course.priceCents / 100);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="bg-secondary">
        <Header />
      </div>
      
      <main className="flex-grow">
        {/* Course Header Banner */}
        <div className="bg-secondary text-white pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 text-sm text-primary mb-6 font-semibold uppercase tracking-wider">
                  <span>{course.category}</span>
                  <ChevronRight className="w-4 h-4" />
                  <span>{course.level}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                  {course.summary}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center text-amber-500 font-bold text-lg">
                    <span>{course.rating.toFixed(1)}</span>
                    <Star className="w-5 h-5 ml-1 fill-current" />
                    <span className="text-white/60 font-normal ml-2 text-base">({course.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{new Intl.NumberFormat().format(course.studentsCount)} students</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    Instructor: <span className="font-semibold text-white ml-1">{course.instructorName}</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:block hidden">
                 {/* Empty space for the floating card on desktop */}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 font-serif text-secondary">What you'll learn</h2>
                <div className="bg-accent/30 p-8 rounded-2xl border border-accent grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-secondary/80">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 font-serif text-secondary">Description</h2>
                <div className="prose max-w-none text-muted-foreground leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: course.description }} />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 font-serif text-secondary">Course Curriculum</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>{course.curriculum?.length || 0} modules</span>
                  <span>•</span>
                  <span>{course.lessonsCount} lessons</span>
                  <span>•</span>
                  <span>{course.durationWeeks} weeks total length</span>
                </div>
                
                <div className="space-y-4">
                  {course.curriculum?.map((module, index) => (
                    <div key={index} className="border border-border rounded-xl p-5 bg-card flex justify-between items-center hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-semibold text-secondary text-lg">{module.title}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {module.lessonsCount} lessons
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar / Floating Card */}
            <div className="lg:col-span-1">
              <div className="lg:-mt-64 bg-card rounded-2xl shadow-xl border border-border overflow-hidden sticky top-24 z-10">
                <div className="aspect-video relative">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group cursor-pointer hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-10 h-10 text-white fill-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    {course.isFree ? (
                      <div className="text-4xl font-bold text-secondary">Free</div>
                    ) : (
                      <div className="flex items-end gap-3">
                        <div className="text-4xl font-bold text-secondary">{priceFormatted}</div>
                        {course.originalPriceCents && (
                          <div className="text-lg text-muted-foreground line-through mb-1">
                            ${(course.originalPriceCents / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button className="w-full h-14 text-lg font-semibold mb-4 shadow-lg shadow-primary/20">
                    {course.isFree ? "Enroll for Free" : "Buy Masterclass"}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mb-8">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="space-y-4 text-sm">
                    <h4 className="font-bold text-secondary">This course includes:</h4>
                    <div className="flex items-center text-muted-foreground">
                      <PlayCircle className="w-5 h-5 mr-3 text-primary" />
                      {course.durationWeeks} weeks of on-demand video
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 mr-3 text-primary" />
                      Downloadable industry toolkits
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-5 h-5 mr-3 text-primary" />
                      Access to private founder community
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-5 h-5 mr-3 text-primary" />
                      Certificate of completion
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
