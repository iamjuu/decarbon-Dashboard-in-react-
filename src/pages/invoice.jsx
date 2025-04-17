import React, { useRef, useState, useEffect } from "react";
import { FaInstagram, FaWhatsapp, FaPrint } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { IoMdArrowBack } from "react-icons/io";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [servicesPerPage, setServicesPerPage] = useState(5);

  const companyInfoData = {
    name: "Nos2 DECARBONISING",
    subTitle: "BIKE AND CAR - ALL VEHICLE",
    instagram: "nos2kannur_enginedecarbonising",
    website: "www.nos2kannur.in",
    whatsapp: "9995443243",
  };

  useEffect(() => {
    const data = sessionStorage.getItem('invoiceData');
    if (data) {
      const parsedData = JSON.parse(data);
      setInvoiceData(parsedData);
      sessionStorage.removeItem('invoiceData');

      // Calculate total pages based on services
      if (parsedData?.services) {
        const firstPageServices = 4;
        const remainingServices = parsedData.services.length - firstPageServices;
        if (remainingServices > 0) {
          setTotalPages(2);
          setServicesPerPage(firstPageServices);
        } else {
          setTotalPages(1);
          setServicesPerPage(parsedData.services.length);
        }
      }
    }
  }, []);

  const getCurrentPageServices = (pageNumber) => {
    if (!invoiceData?.services) return [];
    
    if (pageNumber === 1) {
      return invoiceData.services.slice(0, servicesPerPage);
    } else {
      return invoiceData.services.slice(servicesPerPage);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!invoiceData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <h1 className="mb-4 text-2xl text-gray-800">No invoice data available</h1>
        <button
          onClick={() => window.close()}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Close Window
        </button>
      </div>
    );
  }

  const renderPage = (pageNumber) => (
    <div 
      key={pageNumber}
      className="relative p-8 bg-white shadow-lg print:shadow-none print:p-0" 
      style={{ 
        height: '29.7cm',
        width: '21cm',
        margin: pageNumber === 1 ? '0 auto' : '2cm auto 0',
        boxSizing: 'border-box'
      }}
    >
      {/* Header - Only on first page */}
      {pageNumber === 1 && (
        <>
          {/* Company Header */}
          <div className="pb-6 mb-6 border-b-2 border-red-600">
            <div className="flex flex-row gap-4 justify-between items-start">
              <div className="flex-1">
                <h1 className="mb-1 text-2xl font-bold text-red-600">{companyInfoData.name}</h1>
                <p className="mb-2 text-sm text-gray-600">{companyInfoData.subTitle}</p>
              </div>
              
              <div className="text-sm">
                <div className="grid grid-cols-[24px,1fr] gap-2 items-center mb-2">
                  <FaInstagram className="justify-self-center w-4 h-4 text-pink-600" />
                  <span className="text-base text-gray-600">{companyInfoData.instagram}</span>
                </div>
                <div className="grid grid-cols-[24px,1fr] gap-2 items-center mb-2">
                  <CgWebsite className="justify-self-center w-4 h-4 text-blue-600" />
                  <span className="text-base text-gray-600">{companyInfoData.website}</span>
                </div>
                <div className="grid grid-cols-[24px,1fr] gap-2 items-center">
                  <FaWhatsapp className="justify-self-center w-4 h-4 text-green-600" />
                  <span className="text-base text-gray-600">{companyInfoData.whatsapp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer and Invoice Info */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Customer Details */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Customer Details</h2>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Owner Name:</span>
                  <span className="font-medium">{invoiceData.ownerName}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{invoiceData.phoneNumber}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Vehicle No:</span>
                  <span className="font-medium">{invoiceData.vehicleNumber}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{invoiceData.vehicleModel}</span>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Invoice Details</h2>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[120px,1fr] items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="justify-self-end font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-[120px,1fr] items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="justify-self-end px-3 py-1 text-lg font-bold text-green-600 rounded-full">
                    {invoiceData.servicestatus}
                  </span>
                </div>
                <div className="grid grid-cols-[120px,1fr] items-center">
                  <span className="text-gray-600">Invoice No:</span>
                  <span className="justify-self-end font-medium">{invoiceData._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Vehicle Information</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{invoiceData.vehicleYear}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Kilometer:</span>
                  <span className="font-medium">{invoiceData.kilometer}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{invoiceData.fuelType}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">Smoke:</span>
                  <span className="font-medium">{invoiceData.smoke}</span>
                </div>
                <div className="grid grid-cols-[120px,1fr]">
                  <span className="text-gray-600">LHCE Details:</span>
                  <span className="font-medium">{invoiceData.lhceDetails}</span>
                </div>
              </div>
              {invoiceData.imagelink && (
                <div className="flex justify-end">
                  <img 
                    className="object-contain w-32 h-32" 
                    src={invoiceData.imagelink}
                    alt="Vehicle"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Services Table */}
      <div className={`mb-8 ${pageNumber === 2 ? 'mt-8' : ''}`}>
        <h2 className="mb-3 text-lg font-semibold text-red-600">
          {pageNumber === 1 ? 'Services' : 'Remaining Services'}
        </h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 bg-gray-50 border-y">
                Service Type
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-right text-gray-600 bg-gray-50 border-y">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageServices(pageNumber).map((service, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3 text-sm text-gray-600">{service.serviceType}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">
                  ₹{service.serviceAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          {pageNumber === totalPages && (
            <tfoot>
              <tr className="border-b">
                <td className="px-4 py-3 font-semibold text-right">Total Amount:</td>
                <td className="px-4 py-3 text-right text-gray-600">
                  ₹{invoiceData.services.reduce((sum, s) => sum + s.serviceAmount, 0).toFixed(2)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 font-semibold text-right">Discount:</td>
                <td className="px-4 py-3 text-right text-red-600">
                  -₹{invoiceData.discount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-right">Net Amount:</td>
                <td className="px-4 py-3 font-bold text-right text-gray-800">
                  ₹{invoiceData.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Footer content - Only on last page */}
      {pageNumber === totalPages && (
        <>
          {/* Terms and Conditions */}
          <div className="mb-24">
            <h2 className="mb-3 text-lg font-semibold text-red-600">Terms and Conditions</h2>
            <div className="text-sm text-gray-600">
              {[
                "Your Next Service is After 12 Months or 140,000 km",
                "Decarbonize your vehicle once a year to keep the engine healthy",
                "If you have queries or complaints regarding our service, feel free to contact our technical team"
              ].map((term, index) => (
                <div key={index} className="flex gap-2 items-start mb-2">
                  <span className="flex-shrink-0 w-6 text-right">{index + 1}.</span>
                  <span className="flex-grow">{term}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer with QR Code */}
          <div className="flex absolute right-8 left-8 bottom-12 justify-between items-end">
            <div className="flex-shrink-0 w-20 h-20">
              <QRCode 
                value={companyInfoData.website}
                size={80}
                style={{ 
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
            <div className="text-xs text-right text-gray-500">
              <p>Thank you for your business!</p>
              <p>{companyInfoData.name}</p>
            </div>
          </div>
        </>
      )}

      {/* Page number */}
      <div className="absolute bottom-2 right-4 text-xs text-gray-400">
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-8 min-h-screen bg-gray-900" // Added py-8 for top/bottom padding and dark background
    >
      {/* Print and Close buttons - Added mt-4 for top margin */}
      <div className="flex justify-between mx-auto mb-8 print:hidden" style={{ width: '21cm', marginTop: '2rem' }}>
        <button
          onClick={() => window.close()}
          className="flex items-center px-6 py-2.5 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <IoMdArrowBack className="mr-2" /> Close
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaPrint className="mr-2" /> Print Invoice
        </button>
      </div>

      {/* Invoice Pages Container - Added shadow and better spacing */}
      <div className="pb-8 mx-auto print:p-0" style={{ width: '21cm' }}>
        {[...Array(totalPages)].map((_, i) => renderPage(i + 1))}
      </div>
    </motion.div>
  );
};

export default Invoice;
