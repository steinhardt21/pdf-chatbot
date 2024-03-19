import { useState } from 'react'
import { Expand, Loader2 } from 'lucide-react'
import SimpleBar from 'simplebar-react'
import { Document, Page, pdfjs } from 'react-pdf'
import  { useResizeDetector } from 'react-resize-detector';

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { toast } from './ui/use-toast';

interface PdfFullscreenProps {
  fileUrl: string
}

const PdfFullScreen = ({ fileUrl }: PdfFullscreenProps ) => {
  const { width, ref } = useResizeDetector()
  const [isOpen, setIsOpen] = useState(false)
  const [numPages, setNumPages] = useState<number>();

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(visibility) => {
        if(!visibility) {
          setIsOpen(false)
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant={'ghost'} aria-label='fullscreen'>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
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
              file={fileUrl} 
              className='max-h-full'
            >
              {new Array(numPages).fill(0).map((_, index) => (
                <Page 
                  key={index}
                  width={width ? width : 1} 
                  pageNumber={index + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}

export default PdfFullScreen