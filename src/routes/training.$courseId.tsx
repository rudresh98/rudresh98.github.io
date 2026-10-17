import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/portfolio/content';
import { CourseDetail } from '@/components/portfolio/training';
import { getCourse } from '@/lib/training';
import { pageHead, courseJsonLd, courseSeo, breadcrumbJsonLd } from '@/lib/seo';

export const Route = createFileRoute('/training/$courseId')({
 loader: ({params}) => {
  const course = getCourse(params.courseId);
  if (!course) throw notFound();
  return course;
 },
 head: ({loaderData, params}) => loaderData
  ? pageHead(courseSeo(loaderData).title,courseSeo(loaderData).description,`/training/${loaderData.id}`,{fullTitle:true,jsonLd:[courseJsonLd(loaderData),breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Training',path:'/training'},{name:loaderData.title,path:`/training/${loaderData.id}`}])]})
  : pageHead('Course unavailable','The requested training course is unavailable.',`/training/${params.courseId}`,{noindex:true}),
 component: CoursePage,
 notFoundComponent: () => <CourseUnavailable missing/>,
 errorComponent: () => <CourseUnavailable/>,
});

function CourseUnavailable({missing=false}:{missing?:boolean}) {
 return <Page><section className="section"><h1 className="section-heading">{missing?'Course not found':'This course could not load'}</h1><Button asChild variant="link" className="mt-6 px-0"><Link to="/training"><ArrowLeft/>Back to training</Link></Button></section></Page>;
}

function CoursePage() {
 const course = Route.useLoaderData();
 return <Page><CourseDetail course={course}/></Page>;
}
