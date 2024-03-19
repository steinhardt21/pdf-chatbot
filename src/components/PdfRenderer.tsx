'use client'
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf'
import  { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'; 
import SimpleBar from 'simplebar-react';

import { cn } from '@/lib/utils';
import { toast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import PdfFullScreen from './PdfFullScreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PdfRendererProps {
  url: string
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { width, ref } = useResizeDetector()
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const CustomPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
  })

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  const { 
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TCustomPageValidator>({
        defaultValues: {
          page: '1'
        },
        resolver: zodResolver(CustomPageValidator)
      })

  const handlePageSubmit = ({ 
    page
  }: TCustomPageValidator) => {
    setCurrentPage(Number(page))
    setValue('page', String(page))
  }

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1 > 1 ? prev - 1 : 1)
              setValue('page', String(currentPage - 1))
            }} 
            variant={'ghost'} 
            aria-label='previous page'
          >
            <ChevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input 
              {...register("page")} 
              className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')} 
              onKeyDown={(event) => {
                if(event.key === 'Enter') {
                  handleSubmit(handlePageSubmit)()
                }
              }}
            />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            disabled={currentPage === numPages || numPages === undefined}
            onClick={() => {
              setCurrentPage((prev) => prev + 1 > numPages! ? numPages! : prev + 1)
              setValue('page', String(currentPage + 1))
            }}
            variant={'ghost'} 
            aria-label='next page'
          >
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='zoom' variant={'ghost'} className='gap-1.5'>
                <Search className='h-4 w-4' />
                {scale * 100}% <ChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setRotation(prev => prev + 90)} variant={'ghost'} aria-label='rotate 90 degrees'>
            <RotateCw className='h-4 w-4' />
          </Button>

          <PdfFullScreen fileUrl={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document 
              loading= {
                <div className='flex justify-center'>
                  <Loader2 className='h-6 w-6 my-24 animate-spin' />
                </div>
              } 
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => toast({ title: 'Error loading PDF', description: 'Please try again later', variant: 'destructive'})}
              file={url} 
              className='max-h-full'
            >
              <Page width={width ? width : 1} pageNumber={currentPage} scale={scale} rotate={rotation}/>
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
}

export default PdfRenderer