import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import CoursesContext from '../context/CoursesContext';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const CertificatePreview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [positions, setPositions] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const certificateRef = useRef(null);
  const {courses} = useContext(CoursesContext);

  useEffect(() => {
    const foundCourse = courses?.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      toast.error('Course not found');
      navigate('/');
    }
  }, [courseId, courses, navigate]);

  useEffect(() => {
    if (courseId) {
      const savedPositions = localStorage.getItem(`positions_${courseId}`);
      if (savedPositions) {
        setPositions(JSON.parse(savedPositions));
      } else {
        toast.error('Certificate layout not found. Please design the certificate first.');
        navigate(`/edit/${courseId}`);
      }

      const savedPdfData = localStorage.getItem(`pdfData_${courseId}`);
      if (savedPdfData) {
        setPdfFile(savedPdfData);
      } else {
        toast.error('Certificate template not found. Please upload a template first.');
        navigate(`/edit/${courseId}`);
      }
    }
  }, [courseId, navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

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

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${course.candidateName}-${course.courseName}-Certificate.pdf`);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {course && pdfFile && positions && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigate(`/edit/${courseId}`)}
              className="flex items-center text-blue-600 hover:text-blue-800 hover:text-white bg-black text-white p-3 py-2 rounded-md"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            <h1 className="text-lg md:text-2xl font-bold text-white">Certificate Preview</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => navigate(`/edit/${courseId}`)}
                className="md:text-lg px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit size={16} className="mr-2" /> Edit
              </button>
              
              <button 
                onClick={downloadCertificate}
                disabled={loading}
                className="md:text-lg px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} className="mr-2" /> 
                {loading ? 'Generating...' : 'Download Certificate'}
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 mb-4">Certificate preview:</p>
              <div ref={certificateRef} className="relative border-2 border-dashed p-4 rounded-md h-[200px]">
                {/* <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} className="mb-4">
                  <Page pageNumber={1} />
                </Document> */}
                <QRCodeCanvas
                  value={getQRValue()}
                  size={100}
                  className="absolute top-10 left-[50%]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificatePreview;
