import React, { useState } from 'react';
import { ContactData } from '../types';
import { Button } from './Button';

interface ContactCardProps {
  data: ContactData;
  onSave: (data: ContactData) => void;
  onSaveToGoogleContacts?: (data: ContactData) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({ data, onSave, onSaveToGoogleContacts, onCancel, isSaving }) => {
  const [formData, setFormData] = useState<ContactData>(data);
  const [customFields, setCustomFields] = useState<Array<{key: string, value: string}>>(
    data.customFields 
      ? Object.entries(data.customFields).map(([key, value]) => ({ key, value })) 
      : []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openMap = () => {
    if (formData.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', val: string) => {
    const newFields = [...customFields];
    newFields[index][field] = val;
    setCustomFields(newFields);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const removeCustomField = (index: number) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields);
  };

  const prepareDataForSave = (): ContactData => {
    const customFieldsRecord: Record<string, string> = {};
    customFields.forEach(f => {
      if (f.key.trim()) customFieldsRecord[f.key.trim()] = f.value;
    });
    return { ...formData, customFields: customFieldsRecord };
  };

  // HIGH CONTRAST INPUTS
  const inputClasses = "w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg font-bold text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none transition-all placeholder-gray-400 shadow-sm";
  const labelClasses = "block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
      <div className="bg-[#003366] px-6 py-4 sm:px-8 sm:py-6 text-white flex justify-between items-center border-b-4 border-[#10b981]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Review Details</h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">Verify information before saving</p>
        </div>
        <span className="hidden sm:inline-block text-xs font-bold bg-[#10b981] text-white px-3 py-1.5 rounded shadow-sm">
          EDITABLE
        </span>
      </div>
      
      {/* 
         Mobile Fix: 
         1. Reduced padding (p-4)
         2. Increased gap (gap-6) to prevent overlapping labels 
         3. Specific grid-cols-1 for mobile
      */}
      <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-gray-50">
        <div className="col-span-1 md:col-span-2">
          <label className={labelClasses}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="John Doe"
          />
        </div>

        <div className="col-span-1">
          <label className={labelClasses}>Company</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Company Name"
          />
        </div>

        <div className="col-span-1">
          <label className={labelClasses}>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Job Title"
          />
        </div>

        <div className="col-span-1">
          <label className={labelClasses}>Email 1</label>
          <input
            type="email"
            name="email_1"
            value={formData.email_1}
            onChange={handleChange}
            className={inputClasses}
            placeholder="email@example.com"
          />
        </div>

        <div className="col-span-1">
          <label className={labelClasses}>Email 2</label>
          <input
            type="email"
            name="email_2"
            value={formData.email_2}
            onChange={handleChange}
            className={inputClasses}
            placeholder="secondary@example.com"
          />
        </div>

        <div className="col-span-1">
          <label className={labelClasses}>Phone 1</label>
          <input
            type="tel"
            name="phone_1"
            value={formData.phone_1}
            onChange={handleChange}
            className={inputClasses}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="col-span-1">
          <label className={labelClasses}>Phone 2</label>
          <input
            type="tel"
            name="phone_2"
            value={formData.phone_2}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Secondary Phone"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className={`${labelClasses} flex justify-between items-center`}>
            <span>Address</span>
            {formData.address && (
              <button 
                type="button" 
                onClick={openMap}
                className="text-[#003366] text-xs hover:text-emerald-600 hover:underline flex items-center gap-1 transition-colors font-bold"
                title="Open in Google Maps"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                View Map
              </button>
            )}
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses} resize-none py-3`}
            placeholder="Full Office Address"
          />
        </div>

        {/* Custom Fields Section */}
        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider">Additional Fields</h3>
            <button 
              type="button" 
              onClick={addCustomField}
              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Field
            </button>
          </div>
          
          <div className="space-y-3">
            {customFields.length === 0 && (
              <p className="text-xs text-gray-500 italic">No additional fields added.</p>
            )}
            {customFields.map((field, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                  placeholder="Field Name (e.g. Notes)"
                  className={`${inputClasses} sm:w-1/3 py-2 text-sm`}
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className={`${inputClasses} flex-grow py-2 text-sm`}
                />
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors self-end sm:self-auto"
                  title="Remove Field"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-4 sm:px-8 sm:py-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-2.5 text-base border-gray-300 text-gray-700 hover:bg-gray-100 font-medium order-3 sm:order-1"
        >
          Discard
        </Button>
        {onSaveToGoogleContacts && (
          <Button 
            variant="outline" 
            onClick={() => onSaveToGoogleContacts(prepareDataForSave())} 
            isLoading={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 text-base border-blue-500 text-blue-600 hover:bg-blue-50 font-bold order-2 sm:order-2"
          >
            Save to Google Contacts
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={() => onSave(prepareDataForSave())} 
          isLoading={isSaving}
          className="w-full sm:w-auto px-8 py-2.5 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-bold order-1 sm:order-3"
          style={{ backgroundColor: '#003366' }}
        >
          Upload Data
        </Button>
      </div>
    </div>
  );
};