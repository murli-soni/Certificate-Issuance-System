import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import Draggable from 'react-draggable';
import { ArrowLeft, Save, Eye, Download } from 'lucide-react';
import CoursesContext from '../context/CoursesContext';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const CertificateEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [positions, setPositions] = useState(null);
  const [scale, setScale] = useState(1);
  const certificateRef = useRef(null);
  const { courses } = useContext(CoursesContext);
  const qrCodeRef = useRef(null);
  const candidateNameRef = useRef(null);
  const courseNameRef = useRef(null);
  const courseIdRef = useRef(null);
  const datesRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const foundCourse = courses?.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      toast.error('Course not found');
      navigate('/');
    }
  }, [courseId, courses, navigate]);


  const onDocumentLoadError = (error) => {
    console.error("PDF loading error:", error);
    toast.error('Failed to load PDF. Please try uploading again.');
  };

  useEffect(() => {
    if (courseId) {
      const savedPositions = localStorage.getItem(`positions_${courseId}`);
      if (savedPositions) {
        setPositions(JSON.parse(savedPositions));
      } else {
        setPositions({
          qrcode: { x: 50, y: 50 },
          candidateName: { x: 200, y: 150 },
          courseName: { x: 200, y: 200 },
          courseId: { x: 200, y: 250 },
          dates: { x: 200, y: 300 },
          description: { x: 200, y: 350 }
        });
      }

      const savedPdfData = localStorage.getItem(`pdfData_${courseId}`);
      if (savedPdfData) {
        setPdfFile(savedPdfData);
      }
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId && positions) {
      localStorage.setItem(`positions_${courseId}`, JSON.stringify(positions));
    }
  }, [courseId, positions]);

  const handleFileChange = (e) => {
    debugger
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const pdfData = event.target.result;
          setPdfFile(pdfData);
          localStorage.setItem(`pdfData_${courseId}`, pdfData);
          toast.success('Pdf uploaded successfully');
          
        } catch (error) {
          console.error("Error processing PDF data:", error);
          toast.error('Error processing the PDF. Please try another file.');
        }
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast.error('Error reading the file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDrag = (element, data) => {
    setPositions({
      ...positions,
      [element]: { x: data.x / scale, y: data.y / scale }
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (certificateRef.current) {
        const containerWidth = certificateRef.current.offsetWidth;
        const newScale = Math.min(containerWidth / 750, 1);
        setScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getQRValue = () => {
    if (!course) return '';
    return JSON.stringify({
      certificateId: `CERT-${course.courseId}-${Date.now()}`,
      candidateName: course.candidateName,
      courseName: course.courseName,
      courseId: course.courseId,
      dates: `${course.startDate} to ${course.endDate}`
    });
  };

  const goToPreview = () => {
    navigate(`/preview/${courseId}`);
  };

  return (
    <>
      {course && (
        <div className="mb-8">
          <div className="md:flex justify-between items-center md:mb-4 mb-2">
            <button
              onClick={() => navigate('/')}
              className="flex md:mb-0 mb-3 items-center text-blue-600 hover:text-blue-800 hover:text-white bg-black text-white p-3 py-2 rounded-md"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-white">Design Certificate for {course?.courseName}</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md md:p-6 p-2 border">
            {!pdfFile ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                <p className="mb-4 text-center">
                  Upload a PDF template for your certificate
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <button
                    onClick={() => setPdfFile(null)}
                    className="text-sm md:text-xl px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Change Template
                  </button>

                  <button
                    onClick={goToPreview}
                    className="text-sm md:text-xl px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Eye size={16} className="mr-2" /> Preview Certificate
                  </button>
                </div>


                <div
                  ref={certificateRef}
                  className="relative border border-gray-300 overflow-hidden p-4"
                  style={{
                    height: `${500 * scale}px`,
                    width: '100%'
                  }}
                >

                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    // onLoadError={onDocumentLoadError}
                    loading={<div className="text-center p-4">Loading PDF...</div>}
                    className="absolute top-0 left-0 w-full"
                    options={{ cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/3.11.174/cmaps/', cMapPacked: true }}
                  >
                    {/* <Page
                      pageNumber={1}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={certificateRef.current?.offsetWidth}
                    /> */}
                  </Document>

                  {positions && (
                    <>
                      <Draggable
                        nodeRef={qrCodeRef}
                        position={{ x: positions.qrcode.x * scale, y: positions.qrcode.y * scale }}
                        onStop={(e, data) => handleDrag('qrcode', data)}
                        bounds="parent"
                      >
                        <div ref={qrCodeRef} className="absolute cursor-move p-1 bg-white bg-opacity-50 border border-blue-300 rounded">
                          <QRCodeCanvas value={getQRValue()} size={100 * scale} />
                          <div className="text-xs text-center mt-1 font-bold">QR Code</div>
                        </div>
                      </Draggable>

                      <Draggable
                        nodeRef={candidateNameRef}
                        position={{ x: positions.candidateName.x * scale, y: positions.candidateName.y * scale }}
                        onStop={(e, data) => handleDrag('candidateName', data)}
                        bounds="parent"
                      >
                        <div ref={candidateNameRef} className="absolute cursor-move p-3 bg-white bg-opacity-50 border border-blue-300 rounded">
                          <div className="text-2xl font-bold">{course.candidateName}</div>
                          <div className="text-xs text-center mt-1 font-bold">Candidate Name</div>
                        </div>
                      </Draggable>

                      <Draggable
                        nodeRef={courseNameRef}
                        position={{ x: positions.courseName.x * scale, y: positions.courseName.y * scale }}
                        onStop={(e, data) => handleDrag('courseName', data)}
                        bounds="parent"
                      >
                        <div ref={courseNameRef} className="absolute cursor-move p-3 bg-white bg-opacity-50 border border-blue-300 rounded">
                          <div className="text-xl">{course.courseName}</div>
                          <div className="text-xs text-center mt-1 font-bold">Course Name</div>
                        </div>
                      </Draggable>

                      <Draggable
                        nodeRef={courseIdRef}
                        position={{ x: positions.courseId.x * scale, y: positions.courseId.y * scale }}
                        onStop={(e, data) => handleDrag('courseId', data)}
                        bounds="parent"
                      >
                        <div ref={courseIdRef} className="absolute cursor-move p-3 bg-white bg-opacity-50 border border-blue-300 rounded">
                          <div className="text-sm">ID: {course.courseId}</div>
                          <div className="text-xs text-center mt-1 font-bold">Course ID</div>
                        </div>
                      </Draggable>

                      <Draggable
                        nodeRef={datesRef}
                        position={{ x: positions.dates.x * scale, y: positions.dates.y * scale }}
                        onStop={(e, data) => handleDrag('dates', data)}
                        bounds="parent"
                      >
                        <div ref={datesRef} className="absolute cursor-move p-3 bg-white bg-opacity-50 border border-blue-300 rounded">
                          <div className="text-sm">
                            {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-center mt-1 font-bold">Dates</div>
                        </div>
                      </Draggable>
                      
                      <Draggable
                        nodeRef={descriptionRef}
                        position={{ x: positions.description.x * scale, y: positions.description.y * scale }}
                        onStop={(e, data) => handleDrag('description', data)}
                        bounds="parent"
                      >
                        <div ref={descriptionRef} className="absolute cursor-move p-3 bg-white bg-opacity-50 border border-blue-300 rounded max-w-md">
                          <div className="text-sm">{course.description}</div>
                          <div className="text-xs text-center mt-1 font-bold">Description</div>
                        </div>
                      </Draggable>  
                    </>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateEditor;